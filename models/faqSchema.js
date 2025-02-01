import mongoose from "mongoose";
import FaqTranslation from "./faqTranslationSchema.js";

const faqSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true
    },
    translations: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: FaqTranslation
    }]
},
    { timestamps: true }
)

const Faq = mongoose.model('Faq', faqSchema)
export default Faq