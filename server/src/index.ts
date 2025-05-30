import dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import express from 'express'
import './bot.js' // bot is loaded here
import config from './config.json' with { type: 'json' }
import { usersController } from './controllers/_controllers.js'
import * as routers from './routers/_routers.js'
import cors from 'cors'

const app = express()
app.use(
  cors({
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)
app.use(express.json())

app.use('/api/products', routers.productsRouter)
app.use('/api/orders', routers.ordersRouter)

app.post('/api/login', async (req, res) => {
  await usersController.Login(req.query.id as string)

  res.status(200).json({
    message: 'You have successfully authorized',
    answer: true,
  })
}) // ?id=

const port = process.env.PORT || config.SERVER_PORT
app.listen(port, () =>
  console.log(`Server listening on port ${port}\nhttp://localhost:${port}`)
)
