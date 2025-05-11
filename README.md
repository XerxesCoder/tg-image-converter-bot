
# Telegram Image Converter Bot

A Node.js Telegram bot that converts images between PNG, JPEG, and TIFF formats using Sharp.
[Live Demo](https://t.me/imagetotiff_bot)
## Features

- Convert images to PNG, JPEG, and TIFF formats
- Preserve image quality during conversion
- Simple Telegram interface
- Fast processing with Sharp library

## Requirements

- Node.js v16+
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)

## Setup

1. Clone the repo:
```bash
git clone https://github.com/XerxesCoder/tg-image-converter-bot.git
cd tg-image-converter-bot
```

2. Install dependencies:
```bash
npm install
```

3. Rename `.env.example` to `.env` and add your bot token:
```bash
mv .env.example .env
```
Edit the `.env` file:
```env
BOT_TOKEN=your_bot_token_here
```

## Usage

Start the bot:
```bash
npm start
```

In Telegram:
1. Send any image to your bot
2. Select desired output format
3. Receive converted image

## Commands

- `/start` - Welcome message

## Tech Stack

- [GrammY](https://grammy.dev/) - Telegram bot framework
- [Sharp](https://sharp.pixelplumbing.com/) - Image processing
- [dotenv](https://github.com/motdotla/dotenv) - Environment management

## Deployment

For production:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Contact

If you have any questions or feedback, please feel free to reach out.

- **Telegram**: [@xerxescoder](https://t.me/xerxescoder)
- **Telegram Channel**: [@xerxescodes](https://t.me/xerxescodes)
- **Email**: [xerxescode@gmail.com](mailto:xerxescode@gmail.com)

## License

This project is open-source and available under the [MIT License](LICENSE).

Made with ❤️ by Xerxes

