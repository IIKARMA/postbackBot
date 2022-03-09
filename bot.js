const TelegramAPI = require("node-telegram-bot-api");

require("dotenv").config();
const Agent = require("socks5-https-client/lib/Agent");
const request = require("request");

const bot = new TelegramAPI(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});

// const input = require("input"); // npm i input
const { Api, TelegramClient } = require("telegram");
const { StoreSession } = require("telegram/sessions");
const { KeyboardOption, ComplitedOption, VIPOption } = require("./options");

const storeSession = new StoreSession("bot_sess"); // fill this later with the value from session.save()
var msgs = new Array();
bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" },
  { command: "/login", description: "Проверка ID" },
  { command: "/support", description: "Задать вопрос" }
]);

const GetReferens = async (chatID, traiderID, userName, msgs) => {
  for (let i = 0; i < msgs.length; i++)
    if (msgs[i].message.includes(traiderID) !== false) {
      await SendRegUsers(chatID, traiderID, userName);
      return bot.sendMessage(
        chatID,
        "Супер, можно пополнять👍\n\n💸Пополнение можно делать на любую\nудобную для тебя сумму.\n📣Только 300 грн - это минималка \n от сайта! \n\nСамый эффективный способ обучения\nэто практика, можно сразу применять\nто что изучаешь🚀",
        ComplitedOption
      );
    }
  return bot.sendMessage(
    chatID,
    "Ваш ID не найден, возможно ввели его не правильно🤷🏼♂\n\nИли же прошли регистрацию не по ссылке❌\n\n👉🏻 в таком случае нужно создать новый аккаунт\nпо ссылке на дргую почту и пройти проверку повторно♻️",
    KeyboardOption
  );
};

const SendRegUsers = async (chatID, traiderID, userName) => {
  var request = require("request");
  var dat = new Date();
  var options = {
    method: "POST",
    url: "https://refasd-7ac5.restdb.io/rest/refff",
    headers: {
      "cache-control": "no-cache",
      "x-apikey": process.env.x_app,
      "content-type": "application/json"
    },
    body: {
      chatID: chatID,
      traiderID: traiderID,
      usersName: userName,
      time: `${dat.getDate()}.${dat.getMonth()}.${dat.getFullYear()}|${dat.getHours()}:${dat.getMinutes()}`
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  });
};

const SendDepo = async (chatID, traiderID, userName) => {
  for (let i = 0; i < msgs.length; i++)
    if (msgs[i].message.includes("" + traiderID + ":sum") !== false) {
      await bot.sendMessage(
        chatID,
        "Добро пожаловать в нашу команду 😎 \nПереходи по ссылке и присоединяйся. \n\n 💭Обязательно читай закреп и там же\nсмотри обучающее видео, которое\nвведет тебя в курс дела🎥 ",
        VIPOption
      );
      await SendUserDeposit(userName, traiderID);

      return bot.sendSticker(
        chatID,
        "https://tlgrm.ru/_/stickers/124/52a/12452af4-7e10-3698-b5e9-2d766a75146f/10.webp"
      );
    }
  return bot.sendMessage(
    chatID,
    "💳 Ваш баланс еще не пополнен,\nпроверьте детали транзакцции и повторите проверку повторно ♻️",
    ComplitedOption
  );
};

const SendUserDeposit = async (userName, traiderID) => {
  var dat = new Date();

  var options = {
    method: "POST",
    url: "https://refasd-7ac5.restdb.io/rest/depo",
    headers: {
      "cache-control": "no-cache",
      "x-apikey": process.env.x_app,
      "content-type": "application/json"
    },
    body: {
      userName: userName.toString(),
      traiderID: traiderID.toString(),
      time: `${dat.getDate()}.${dat.getMonth()}.${dat.getFullYear()}|${dat.getHours()}:${dat.getMinutes()}`
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  });
};
const GetDeposit = async (chatID) => {
  var request = require("request");

  var options = {
    method: "GET",
    url: "https://refasd-7ac5.restdb.io/rest/refff",
    headers: {
      "cache-control": "no-cache",
      "x-apikey": process.env.x_app
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    let rez = JSON.parse(body);
    for (let i = 0; i < rez.length; i++) {
      if (rez[i].chatID.toString().includes(chatID.toString()) !== false) {
        return SendDepo(chatID, rez[i].traiderID, rez[i].usersName);
      }
    }
  });
};

async () => {};

const start = async () => {
  const client = new TelegramClient(
    storeSession,
    parseInt(process.env.apiId),
    process.env.apiHash,
    {}
  );
  await client.connect();

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;
    const userName = msg.chat.username;
    try {
      if (text === "/support") {
        return bot.sendMessage(
          chatID,
          `❓Если что-то не получается
Пиши сюда, поможем -> @vip_mngr `
        );
      }
      if (text === "/login") {
        return bot.sendMessage(
          chatID,
          "  📣 Напишите свой ID в таком формате: 121760887 \n\n Вводить ID нужно \n❗️ТОЛЬКО ЦИФРАМИ❗️"
        );
      }
      if (text === "/start") {
        await bot.sendSticker(
          chatID,
          "https://tlgrm.ru/_/stickers/124/52a/12452af4-7e10-3698-b5e9-2d766a75146f/5.webp"
        );

        await bot.sendMessage(
          chatID,
          "     Привет👋  \n ❗️КАК ПОПАСТЬ В VIP❗ \n\n 1) Регистрируйся по ссылке: \n \n https://bit.ly/32KLW7L\n\n  2) После регистрации, \n скидывай мне свой id на проверку. \n Если регистрация была по  \n ссылке, я напишу что можно пополнять. \n\n  📣Важно регистрироваться\nчерез браузер, для того чтобы\n увидеть свой id. \n \n💬когда все сделаешь скинем ссылку на VIP💰  \n\n ⬇️Где найти id показано на \n скринах ниже ⬇️"
        );

        await bot.sendPhoto(chatID, "./IMG/instruction.JPEG");

        return bot.sendMessage(
          chatID,
          "Зарегистрировался? Идем дальше⬇️",
          KeyboardOption
        );
      }
      if (/\d+/g.test(text) !== false) {
        await bot.sendMessage(
          chatID,
          "Ожидайте, я проверяю информацию🌐\nСкоро напишу💬"
        );
        msgs = await client.getMessages("LoginEgorushkaVIP_bot", {
          limit: 3000
        });
        await GetReferens(chatID, text, userName, msgs);
      } else {
        return bot.sendMessage(chatID, "Я Вас не понимаю");
      }
    } catch (e) {
      await bot.sendMessage(chatID, `ОШИБКА-${e}`);
    }
  });
};
bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatID = msg.message.chat.id;

  if (data === "verificationID") {
    return bot.sendMessage(
      chatID,
      "  📣 Напишите свой ID в таком формате: 121760887 \n\n Вводить ID нужно \n❗️ТОЛЬКО ЦИФРАМИ❗️"
    );
  }
  if (data === "сomplitedDepo") {
    await bot.sendMessage(
      chatID,
      "Ожидайте, я проверяю информацию🌐\nСкоро напишу💬"
    );
    await GetDeposit(chatID);
  }
  if (data === "supportChat") {
    return bot.sendMessage(
      chatID,
      `❓Если что-то не получается
        Пиши сюда, поможем -> @vip_mngr `
    );
  }
  if (data === "searchID") {
    await bot.sendPhoto(chatID, "./IMG/search_ID_firstStep.JPG");
    await bot.sendPhoto(chatID, "./IMG/search_ID_secondStep.JPG");
  }
  if (data === "link") {
    return bot.sendMessage(chatID, "https://binomo.com?a=5a848d6734d4");
  } else if (data.message) {
    return bot.sendMessage(chatID, "ook");
  }
});
start();
