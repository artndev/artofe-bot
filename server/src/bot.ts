import dotenv from 'dotenv'
dotenv.config()

import TelegramBot from 'node-telegram-bot-api'
import {
  ordersController,
  usersController,
} from './controllers/_controllers.js'
const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true })

// bot.onText(/\/get_chat_id/, msg => {
//   bot.sendMessage(msg.chat.id, `The current chat id is ${msg.chat.id}`)
// })

bot.onText(/\/start/, async msg => {
  bot.sendMessage(
    msg.chat.id,
    `
Hello @${msg.from?.username}! Welcome to the coffee shop — *Artofe* ☕

If you want to go further, select the particular option below my message. Enjoy yourself!
    `,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '👤 Account Info', callback_data: 'account' }],
          [{ text: '🔄️ History', callback_data: 'history' }],
          [{ text: '✨ Discount Levels', callback_data: 'discount' }],
        ],
      },
      parse_mode: 'Markdown',
    }
  )
})

bot.on('callback_query', async query => {
  try {
    const id = query.from.id.toString()

    const res = await usersController.Login(id)
    if (!res) throw new Error('User is not authorized')

    const data = await ordersController.getDiscountLevel(id)
    const answer = data?.answer
    const discountLevel = answer?.DiscountLevel
    const checks = answer?.Checks
    console.log(checks)

    switch (query.data) {
      case 'account':
        bot.sendMessage(
          query.from.id,
          `
👤 *Account Info*
━━━━━━━━━━━━━━━━━━
*Username* — @${query.from.username}  
*ID* — \`${query.from.id}\`
*Purchases* — x${checks?.length || 0}
*Discount Level* — ${discountLevel || 'None'}
          `,
          {
            parse_mode: 'Markdown',
          }
        )
        break
      case 'discount': {
        bot.sendMessage(
          query.from.id,
          `
✨ *Discount Levels:*
━━━━━━━━━━━━━━━━━━
*None* ${!discountLevel && '👈'}
 (x0 purchases)
*Bronze* — 5% off ${discountLevel === 'Bronze' && '👈'}
 (x50 purchases)
*Silver* — 10% off ${discountLevel === 'Silver' && '👈'}
 (x100 purchases)
*Gold* — 15% off ${discountLevel === 'Gold' && '👈'}
 (x150 purchases)
          `,
          {
            parse_mode: 'Markdown',
          }
        )
        break
      }
      case 'history': {
        bot.sendMessage(
          query.from.id,
          `
🔄️ *History:*
━━━━━━━━━━━━━━━━━━
${
  checks?.length
    ? checks.map((check, i) => {
        return `${i + 1}. *Check — ${check.TotalPrice}*\n\`${check.ReferenceId}\`\n`
      })
    : 'Your history is empty...'
}
          `,
          {
            parse_mode: 'Markdown',
          }
        )
        break
      }
    }

    await bot.answerCallbackQuery(query.id)
  } catch (err) {
    console.log(err)

    bot.sendMessage(query.from.id, '❌ Server is not responding')
  }
})
