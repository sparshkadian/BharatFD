import mongoose from 'mongoose'

const faqTranslationSchema = mongoose.Schema({
    language: {
        type: String,
        required: true
    },

    question: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

const FaqTranslation = mongoose.model('FaqTranslation', faqTranslationSchema);
export default FaqTranslation