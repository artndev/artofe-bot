import express from 'express'
import { productsController } from '../controllers/_controllers.js'

const router = express.Router()

router.get('/', productsController.GetAll)

router.get('/:id', productsController.Get)

export default router
