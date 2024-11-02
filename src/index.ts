import { Bot } from "grammy";
import * as dotenv from "dotenv";
import main from "./yallakora"
dotenv.config();
let Token = process.env.TOKEN
//Create a new bot
const bot = new Bot(`${Token}`);
const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
bot.on("message", (ctx) => {
  if (ctx.message.text.match(regex)) {
    main(ctx.message.text.toString()).then(async (data) => {
      if(data.matchelist.length >= 1) {
        const markdownTable = data.matchelist.map(data => {
          return data.map(row => {
            return `${Object.values(row).join(' | ')}\n`;
          }) 
        })
        await ctx.api.sendMessage(ctx.message.chat.id,`${markdownTable}`);
      } else{
        await ctx.reply("no match this day")
      }
      })
  }else{
    ctx.reply("enter data like 10/31/2024")
  }
});
//Start the Bot
bot.start();
