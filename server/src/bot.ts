import dotenv from 'dotenv'
dotenv.config()

import { usersController } from './controllers/_controllers.js'
import axios from './axios.js'
import TelegramBot, { WebAppInfo } from 'node-telegram-bot-api'
import { Auth } from './auth.js'
const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true })

// bot.onText(/\/get_chat_id/, msg => {
//   bot.sendMessage(msg.chat.id, `The current chat id is ${msg.chat.id}`)
// })
const authController = new Auth()
bot.onText(/\/start/, async msg => {
  const res = await usersController.Login(msg.from!.id.toString())
  authController.auth = res.answer!

  bot.sendMessage(
    msg.chat.id,
    `Hello @${msg.from?.username}! Welcome to the coffee shop — *Artofe* ☕\n\nIf you want to go further, select the particular option below my message. Enjoy yourself!`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '👤 Account', callback_data: 'account' }],
          [{ text: '✨ Discounts Program', callback_data: 'discounts' }],
          [{ text: '📪 Feedback Form', callback_data: 'feedback' }],
        ],
      },
      parse_mode: 'Markdown',
    }
  )
})

bot.on('callback_query', async query => {
  try {
    if (!authController.auth) throw new Error('User is not authorized')

    if (query.data === 'discounts') {
      bot.sendMessage(
        query.from.id,
        `_You have already bought 15 cups of coffee. Impressive!_\n✨ Your current level of the discount is:\n\n"*> 1. Bronze (x50 purchases) — 5%*"\n2. Silver (x100 purchases) — 10%\n3. Gold (x150 purchases) — 15%`,
        {
          parse_mode: 'Markdown',
        }
      )
    }
  } catch (err) {
    console.log(err)

    bot.sendMessage(query.from.id, '❌ Server is not responding')
  }
})
