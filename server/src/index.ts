import dotenv from 'dotenv'
dotenv.config()

import path from 'path'
const clientBuildPath = path.join(process.cwd(), '../', 'client', 'dist')

import express from 'express'
import './bot.js' // bot is loaded here
import config from './config.json' with { type: 'json' }
import * as routers from './routers/_routers.js'
import './strategies/_strategies.js'
// import cors from 'cors'

const app = express()
// app.use(
//   cors({
//     origin: config.CLIENT_URL,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//   })
// )
app.use(express.json())
app.use(express.static(clientBuildPath))

app.use('/api/products', routers.productsRouter)
app.use('/api/orders', routers.ordersRouter)

app.get('/*', (_req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})

const port = config.SERVER_PORT
app.listen(port, () =>
  console.log(`Server listening on port ${port}\nhttp://localhost:${port}`)
)
