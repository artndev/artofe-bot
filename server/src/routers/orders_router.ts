import express from 'express'
import config from '../config.json' with { type: 'json' }
import { ordersController } from '../controllers/_controllers.js'

const router = express.Router()

router.post('/checkout', ordersController.createCheckoutSession)

router.get('/success', ordersController.createCheck, (_req, res) => {
  res.send(`
    <html>
      <head>
        <script>
          setTimeout(function() {
            window.location.href = "${config.CLIENT_URL}/products";
          }, 3000);
        </script>
      </head>
      <body>
        Transaction was <strong>successful</strong>. Redirecting to products page...
      </body>
    </html>
  `)
}) // ?token=

router.get('/cancel', (_req, res) => {
  res.send(`
    <html>
      <head>
        <script>
          setTimeout(function() {
            window.location.href = "${config.CLIENT_URL}/products";
          }, 3000);
        </script>
      </head>
      <body>
        Transaction was <strong>cancelled</strong>. Redirecting to products page...
      </body>
    </html>
  `)
})

export default router
