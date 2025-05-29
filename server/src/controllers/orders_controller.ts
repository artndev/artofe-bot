import dotenv from 'dotenv'
dotenv.config()

import { NextFunction, Request, Response } from 'express'
import type { ResultSetHeader } from 'mysql2'
import { Stripe } from 'stripe'
import { v4 as uuidv4 } from 'uuid'
import config from '../config.json' with { type: 'json' }
import pool from '../pool.js'
import jwt from 'jsonwebtoken'
import { ordersController } from './_controllers.js'

const stripe = new Stripe(process.env.STRIPE_SECRET!)

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const lineItems = req.body.products.map((product: IProductCheckout) => ({
      price_data: {
        currency: product.currency,
        product_data: {
          name: `${product.name} • ${product.variant.color} • ${product.variant.size}`,
          images: [product.variant.image],
          metadata: {
            id: product.id,
          },
        },
        unit_amount: Math.round(product.price * 100), // dollars
      },
      quantity: product.quantity,
    }))
    const referenceId = uuidv4()
    const userId = req.body.userId

    const token = jwt.sign(
      {
        jti: uuidv4(),
        userId: userId,
        referenceId: referenceId,
        lineItems: JSON.stringify(lineItems),
        totalPrice: req.body.totalPrice,
      },
      process.env.JWT_SECRET!,
      {
        algorithm: 'HS256',
        expiresIn: '1h',
      }
    )

    const sessionData = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${config.SERVER_URL}/api/orders/success?token=${token}`,
      cancel_url: `${config.SERVER_URL}/api/orders/cancel`,
      client_reference_id: referenceId,
    }
    const discountData = await ordersController.getDiscountLevel(userId)
    const discountLevel = Number(
      discountData.answer?.DiscountLevel?.discount || 0
    )

    console.log(discountLevel)
    let newSessionData = {}
    if (discountLevel) {
      const coupon = await stripe.coupons.create({
        percent_off: discountLevel,
        duration: 'once',
      })

      newSessionData = {
        ...sessionData,
        discounts: [
          {
            coupon: coupon.id,
          },
        ],
      }
    } else newSessionData = sessionData

    const session = await stripe.checkout.sessions.create(newSessionData)

    res.status(200).json({
      message: 'You have successfully created check',
      answer: {
        id: session.id,
      },
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: 'Server is not responding',
      answer: err,
    })
  }
}

const createCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.query.token as string

    jwt.verify(token, process.env.JWT_SECRET!)

    const data = jwt.decode(token) as IJwtPayload

    const [rows] = await pool.query<IProduct[]>(
      'SELECT * FROM Checks WHERE ReferenceId = ? AND UserId = ?;',
      [data.referenceId, data.userId]
    )

    if (rows.length) {
      res.status(400).json({
        message: 'You have already created check with such id',
        answer: null,
      })
      return
    }

    await pool.query<ResultSetHeader>(
      'INSERT INTO Checks (ReferenceId, LineItems, TotalPrice, UserId) VALUES (?, ?, ?, ?);',
      [data.referenceId, data.lineItems, data.totalPrice, data.userId]
    )

    next()
  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Server is not responding',
      answer: err,
    })
  }
}

const getChecks = async (id: string) => {
  try {
    const [rows] = await pool.query<ICheck[]>(
      'SELECT * FROM Checks WHERE UserId = ?;',
      [id]
    )

    return {
      message: 'You have successfully got checks of user',
      answer: rows,
    }
  } catch (err) {
    console.log(err)

    return {
      message: 'Server is not responding',
      answer: null,
    }
  }
}

const getDiscountLevel = async (id: string) => {
  try {
    const checks = await getChecks(id)
    let discountLevel = null

    const answer = checks?.answer
    if (!answer) throw new Error('Checks have not been loaded')

    for (const [key, val] of Object.entries(config.DISCOUNT_LEVELS)) {
      if (answer.length >= Number(key)) discountLevel = val
    }

    return {
      message: 'You have successfully discount level of user',
      answer: {
        DiscountLevel: discountLevel,
        Checks: answer,
      },
    }
  } catch (err) {
    console.log(err)

    return {
      message: 'Server is not responding',
      answer: null,
    }
  }
}

export default {
  createCheckoutSession,
  // middleware
  createCheck,
  getChecks,
  getDiscountLevel,
}
