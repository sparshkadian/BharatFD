import express from 'express'
import { createFaqTranslations, getFaqTranslations } from '../controllers/faqController.js'

const router = express.Router()

router.route('/').get(getFaqTranslations).post(createFaqTranslations)

export default router