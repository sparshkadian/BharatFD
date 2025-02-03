import chai from "chai";
import sinon from "sinon";
import chaiAsPromised from "chai-as-promised";
import Faq from "../models/faqSchema.js";
import FaqTranslation from "../models/faqTranslationSchema.js";
import redisClient from "../index.js";
import * as deepl from "deepl-node";
import { createFaqTranslations, getFaqTranslations } from "../controllers/faqController.js";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("FAQ Controller", () => {
    let req, res, stubFaq, stubFaqTranslation, redisStub;

    beforeEach(() => {
        req = { body: {}, query: {}, params: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        stubFaq = sinon.stub(Faq, "findOne");
        stubFaqTranslation = sinon.stub(FaqTranslation, "create");

        redisStub = sinon.stub(redisClient, "get");
        sinon.stub(redisClient, "setEx");
        sinon.stub(redisClient, "del");

        sinon.stub(deepl.Translator.prototype, "translateText");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("createFaqTranslations", () => {
        it("should return a message if translation already exists", async () => {
            const existingTranslation = { language: "en" };
            const existingFaq = { translations: [existingTranslation] };

            req.body = { question: "What is Node.js?", answer: "It is a runtime." };
            req.query.lang = "en";

            stubFaq.resolves(existingFaq);

            await createFaqTranslations(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({
                message: "Translation for en already exists",
            })).to.be.true;
        });

        it("should create a new FAQ and translation if no existing FAQ is found", async () => {
            req.body = { question: "What is Node.js?", answer: "It is a runtime." };
            req.query.lang = "es";

            stubFaq.resolves(null);
            stubFaqTranslation.resolves({
                language: "es",
                question: "¿Qué es Node.js?",
                answer: "Es un entorno de ejecución.",
            });
            sinon.stub(Faq, "create").resolves({
                question: req.body.question,
                answer: req.body.answer,
                translations: [],
            });

            await createFaqTranslations(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWithMatch({
                message: "FAQ created successfully with translation",
            })).to.be.true;
        });
    });

    describe("getFaqTranslations", () => {
        it("should return cached FAQs if available", async () => {
            const cachedFaqs = [{ question: "What is Node.js?", answer: "It is a runtime." }];
            redisStub.resolves(JSON.stringify(cachedFaqs));

            req.query.lang = "en";

            await getFaqTranslations(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({
                cached: true,
                faqs: cachedFaqs,
            })).to.be.true;
        });

        it("should return FAQs from the database if not cached", async () => {
            req.query.lang = "en";

            const faq = {
                question: "What is Node.js?",
                answer: "It is a runtime.",
                translations: [
                    { language: "en", question: "What is Node.js?", answer: "It is a runtime." },
                ],
            };

            sinon.stub(Faq, "find").resolves([faq]);

            await getFaqTranslations(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({
                cached: false,
                faqs: [
                    {
                        question: "What is Node.js?",
                        answer: "It is a runtime.",
                        translation: { question: "What is Node.js?", answer: "It is a runtime." },
                    },
                ],
            })).to.be.true;
        });
    });
});
