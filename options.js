require("dotenv").config();
module.exports = {
  KeyboardOption: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Проверить ID", callback_data: "verificationID" }],
        [{ text: "❓Задать вопрос❓", callback_data: "supportChat" }]
      ]
    })
  },
  ComplitedOption: {
    reply_markup: JSON.stringify({
      inline_keyboard: [[{ text: "Пополнил", callback_data: "сomplitedDepo" }]]
    })
  },
  VIPOption: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: "Перейти",
            url: process.env.LINK_BOT_URL
          }
        ]
      ]
    })
  }
};
