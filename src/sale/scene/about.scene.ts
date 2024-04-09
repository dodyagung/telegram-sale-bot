import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { sendMessage } from '../sale.common';

@Scene('ABOUT_SCENE')
export class AboutScene {
  @SceneEnter()
  onSceneEnter(@Ctx() ctx: SceneContext): void {
    const keyboard = [[Markup.button.callback('👈 Back', 'back')]];

    let message: string = `*🤖 About*\n\n`;
    message += `*telegram\\-sale\\-bot*\n`;
    message += `I\\'m a bot to automate your scheduled\\-sale in Telegram group\\.\n`;
    message += `Open\\-sourced at [GitHub](https://github.com/dodyagung/telegram-sale-bot)\\. Built with [NestJS](https://nestjs.com) and [Telegraf](https://telegraf.js.org)\\.\n`;
    message += `Made with ♥ in Jakarta, Indonesia\\.\n\n`;

    message += `*Contact Us*\n`;
    message += `Found an error? Have a question? Open a [GitHub Issues](https://github.com/dodyagung/telegram-sale-bot/issues)\\.\n\n`;

    message += `*Contribute*\n`;
    message += `If you are developer, open a [GitHub Pull Request](https://github.com/dodyagung/telegram-sale-bot/pulls)\\.\n\n`;

    message += `*Creator*\n`;
    message += `Hi, I\\'m Dody\\. A backend enthusiast\\. Loves Golang and Typescript\\.\n`;
    message += `Visit my website at [dodyagung\\.com](https://dodyagung.com)\\.\n\n`;

    message += `*License*\n`;
    message += `This open\\-source project is licensed under [MIT license](https://github.com/dodyagung/telegram-sale-bot/blob/master/LICENSE.md)\\.`;

    sendMessage(ctx, message, keyboard);
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }
}
