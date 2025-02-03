import FaqTranslation from '../models/faqTranslationSchema.js'
import Faq from '../models/faqSchema.js'
import redisClient from '../index.js'
import * as deepl from 'deepl-node'

async function translateText(question, answer, to) {

    const authKey = process.env.AUTH_KEY
    const translator = new deepl.Translator(authKey)

    const questionTranslation = await translator.translateText(question, null, to);
    const answerTranslation = await translator.translateText(answer, null, to);

    const newTranslation = await FaqTranslation.create({
        language: to,
        question: questionTranslation.text,
        answer: answerTranslation.text
    })
    return newTranslation
}

export const createFaqTranslations = async (req, res) => {
    try {

        const { question, answer } = req.body;
        let lang = req.query.lang || ['en']

        await redisClient.del(`faqs:${lang}`)

        const existingFaq = await Faq.findOne({ question }).populate('translations')

        if (existingFaq) {
            const existingTranslation = existingFaq.translations.find((translation) => translation.language === lang)

            if (existingTranslation) {
                return res.status(200).json({
                    message: `Translation for ${lang} already exists`,
                    faq: existingFaq
                })
            } else {
                const newTranslation = await translateText(question, answer, lang)

                existingFaq.translations.push(newTranslation._id)
                await existingFaq.save()

                return res.status(200).json({
                    message: `Translation for '${lang}' added successfully`,
                    faq: existingFaq,
                })
            }
        }

        const newTranslation = await translateText(question, answer, lang)

        const newFaq = await Faq.create({ question, answer, translations: [newTranslation._id] });
        res.status(201).json({
            message: 'FAQ created successfully with translation',
            faq: newFaq,
        });
    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ message: 'Failed to create FAQ' });
    }
}

export const getFaqTranslations = async (req, res) => {
    try {

        let lang = req.query.lang || ['en']

        const cachedKey = `faqs:${lang}`
        const cachedFaqs = await redisClient.get(cachedKey);

        if (cachedFaqs) {
            return res.status(200).json({
                cached: true,
                faqs: JSON.parse(cachedFaqs)
            });
        }

        const faqs = await Faq.find().populate('translations');

        const result = faqs.map((faq) => {
            const { answer, question, translations } = faq
            const requiredTransaltion = translations.find((translation) => translation.language === lang)

            return {
                question,
                answer,
                translation: requiredTransaltion ? {
                    question: requiredTransaltion.question,
                    answer: requiredTransaltion.answer,
                } : null
            }
        })

        await redisClient.setEx(cachedKey, 3600, JSON.stringify(result))

        res.status(200).json({
            cached: false,
            faqs: result
        });
    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ message: 'Failed to create FAQ' });
    }
}