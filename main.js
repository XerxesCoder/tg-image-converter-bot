require("dotenv").config();
const { Bot, InlineKeyboard, InputFile } = require("grammy");
const sharp = require("sharp");
const bot = new Bot(process.env.BOT_TOKEN);

const userStates = new Map();

const imagekeyboard = new InlineKeyboard()
  .text("TIFF", "convert_tiff")
  .text("JPEG", "convert_jpeg")
  .text("PNG", "convert_png");

bot.command("start", (ctx) => {
  ctx.reply(
    "Send me an image as a document\nUncheck Compress the Image when sending the image\n\nSupported formats: *TIFF, JPEG, JPG, PNG*\nMax file size: *20MB*",
    {
      parse_mode: "Markdown",
    }
  );
});

bot.on("message:photo", async (ctx) => {
  await ctx.reply(
    "Send me an image as a document\n\nUncheck Compress the Image when sending the image"
  );
});
bot.on("message:document", async (ctx) => {
  try {
    const fileId = ctx.message.document.file_id;

    const file = await ctx.api.getFile(fileId);

    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
    const processingMsg = await ctx.reply("⏳ Processing image...");
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to download file");

    const buffer = Buffer.from(await response.arrayBuffer());
    const userImage = await sharp(buffer).metadata();

    userStates.set(ctx.from.id, buffer);

    await ctx.api.editMessageText(
      processingMsg.chat.id,
      processingMsg.message_id,
      `Format: ${userImage.format}\nSize: ${userImage.width} * ${userImage.height}\nDPI: ${userImage.density}\nChannel: ${userImage.space}\n\nChoose output format:`,
      { reply_markup: imagekeyboard }
    );
  } catch (err) {
    console.error(err);
    ctx.reply("❌ Error: Failed to process image.");
  }
});

bot.callbackQuery(/convert_(.+)/, async (ctx) => {
  try {
    const format = ctx.match[1];
    const userId = ctx.from.id;
    const buffer = userStates.get(userId);

    if (!buffer) {
      await ctx.answerCallbackQuery(
        "⚠️ No image found. Please send one first."
      );
      await ctx.editMessageText("⚠️ No image found. Please send one first.");
      return;
    }
    await ctx.editMessageText(`⏳ Converting to ${format.toUpperCase()}...`);

    let outputBuffer;
    const filename = `converted.${format}`;

    switch (format) {
      case "tiff":
        outputBuffer = await sharp(buffer)
          .removeAlpha()
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .toColorspace("cmyk")
          .withMetadata({ density: 72 })
          .tiff({ compression: "lzw" })
          .toBuffer();
        break;

      case "jpeg":
        outputBuffer = await sharp(buffer)
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: 90 })
          .toBuffer();
        break;

      case "png":
        outputBuffer = await sharp(buffer).png().toBuffer();
        break;
    }
    await ctx.deleteMessage();
    await ctx.answerCallbackQuery(`✅ Converted to ${format.toUpperCase()}...`);
    const dataofImage = await sharp(outputBuffer).metadata();

    await ctx.replyWithDocument(new InputFile(outputBuffer, filename), {
      caption: `✅ Converted to ${format.toUpperCase()}!\n📋Size: ${
        dataofImage.width
      } * ${dataofImage.height}\n🕳️DPI: ${dataofImage.density}\n🟧Channel: ${
        dataofImage.space
      }`,
    });

    userStates.delete(userId);
  } catch (err) {
    console.error(err);
    await ctx.reply("❌ Conversion failed. Please try again.");
  }
});
bot.catch((err) => {
  console.error("Bot error:", err);
});

bot
  .start()
  .then(console.log("Bot is now running!"))
  .catch((err) => {
    console.error("Failed to start bot:", err);
    process.exit(1);
  });
