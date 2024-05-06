const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const wrongAnswersStickers = [
  "https://sl.combot.org/chelici/webp/4xf09f8c9f.webp",
  "https://sl.combot.org/chelici/webp/111xf09f8c9f.webp",
  "https://sl.combot.org/chelici/webp/90xf09f8c9f.webp",
  "https://sl.combot.org/chelici/webp/86xf09f8c9f.webp",
  "https://sl.combot.org/chelici/webp/70xf09f8c9f.webp",
  "https://sl.combot.org/chelici/webp/23xf09f8c9f.webp",
  "https://sl.combot.org/chelici/webp/18xf09f8c9f.webp",
  "https://sl.combot.org/chelici/webp/11xf09f8c9f.webp",
];

const correctAnswersStickers = [
  "https://sl.combot.org/chelici/webp/103xf09f8c9f.webp",
];

const token = "6676257405:AAFnU70Mmzw9jQLqPSjK6qrGZRpNIO6zGkw";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю цифру от 0 до 9, а ты ее попробуешь угадать :Ж`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === "/start") {
        await bot.sendSticker(
          chatId,
          "https://sl.combot.org/chelici/webp/26xf09f8c9f.webp"
        );
        return (
          bot.sendMessage(chatId, `Напиши для этого '/game'`),
          bot.sendMessage(
            chatId,
            `Привет! Ты в приколдесном чат-боте(если шо), тут ты можешь поиграть в угадайку :)`
          )
        );
      }

      if (text === "/info") {
        await bot.sendSticker(
          chatId,
          "https://sl.combot.org/chelici/webp/25xf09f8c9f.webp"
        );
        return bot.sendMessage(
          chatId,
          `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
        );
      }

      if (text === "/game") {
        return startGame(chatId);
      }

      await bot.sendSticker(
        chatId,
        "https://sl.combot.org/chelici/webp/5xf09f8c9f.webp"
      );
      return bot.sendMessage(chatId, "Шото пошло не по плану :(");
    } catch (e) {
      await bot.sendSticker(
        chatId,
        "https://sl.combot.org/chelici/webp/5xf09f8c9f.webp"
      );
      return bot.sendMessage(chatId, "Шото пошло не по плану :(");
    }
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") return startGame(chatId);

    if (data == chats[chatId]) {
      await bot.sendSticker(chatId, correctAnswersStickers[0]);
      return bot.sendMessage(
        chatId,
        `Красавчик! Ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      await bot.sendSticker(
        chatId,
        wrongAnswersStickers[
          Math.floor(Math.random() * wrongAnswersStickers.length)
        ]
      );
      return bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
