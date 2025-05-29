import dotenv from 'dotenv'
dotenv.config()

import TelegramBot from 'node-telegram-bot-api'
import config from './config.json' with { type: 'json' }
import {
  ordersController,
  usersController,
} from './controllers/_controllers.js'

const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true })

// bot.onText(/\/get_chat_id/, msg => {
//   bot.sendMessage(msg.chat.id, `The current chat id is ${msg.chat.id}`)
// })

bot.onText(/\/start/, async msg => {
  try {
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
            [{ text: '✨ Discount Levels', callback_data: 'discount' }],
            [{ text: '🔄️ History', callback_data: 'history' }],
          ],
        },
        parse_mode: 'Markdown',
      }
    )
  } catch (err) {
    console.log(err)

    bot.sendMessage(msg.chat.id, '❌ Server is not responding')
  }
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
Username — @${query.from.username}  
ID — \`${query.from.id}\`
Purchases — *x${checks?.length || 0}*
Discount Level — *${discountLevel?.name || 'None'}*
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
✨ *Discount Levels*
━━━━━━━━━━━━━━━━━━
*None*${!discountLevel ? ' 👈' : ''}

1. *Bronze — ${config.DISCOUNT_LEVELS_REVERSED['Bronze'].discount}% off*${discountLevel?.name === 'Bronze' ? ' 👈' : ''}
> x${config.DISCOUNT_LEVELS_REVERSED['Bronze'].amount} purchases

2. *Silver — ${config.DISCOUNT_LEVELS_REVERSED['Silver'].discount}% off*${discountLevel?.name === 'Silver' ? ' 👈' : ''}
> x${config.DISCOUNT_LEVELS_REVERSED['Silver'].amount} purchases

3. *Gold — ${config.DISCOUNT_LEVELS_REVERSED['Gold'].discount}% off*${discountLevel?.name === 'Gold' ? ' 👈' : ''}
> x${config.DISCOUNT_LEVELS_REVERSED['Gold'].amount} purchases
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
🔄️ *History*
━━━━━━━━━━━━━━━━━━
${
  checks?.length
    ? checks
        .map((check, i) => {
          return `${i + 1}. *Check — ${check.TotalPrice}*\n\`${check.ReferenceId}\`\n${JSON.parse(
            check.LineItems
          )
            .map((val: ILineItem) => {
              return `> ${val.price_data.product_data.name}${val.quantity > 1 ? ` (x${val.quantity})` : ''}`
            })
            .join('\n')}`
        })
        .join('\n\n')
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
