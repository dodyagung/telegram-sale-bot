import { Hears, Start, Update, Ctx, Sender } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { SaleService } from './sale.service';

@Update()
export class SaleUpdate {
  constructor(private saleService: SaleService) {}

  @Start()
  @Hears(['hi', 'hello', 'hey', 'qq', 'a'])
  async onGreetings(
    @Ctx() ctx: Context,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
  ): Promise<void> {
    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('💰 My Sale', 'sale'),
        Markup.button.callback('👤 My Profile', 'profile'),
      ],
      [
        Markup.button.callback('❓ Tutorial', 'tutorial'),
        Markup.button.callback('🤖 About', 'about'),
      ],
    ]);

    let message = `*🏠 Welcome*\n\n`;
    message += `Hello *${firstName}${lastName ? ' ' + lastName : ''}*, I'm [telegram\\-sale\\-bot](https://github.com/dodyagung/telegram-sale-bot)\\. Now is *${this.saleService.today()}*, what can I help you today?\n\n`;

    message += `*Sale Time*\n`;
    message += `├ Sale Day : \`${this.saleService.saleDate()}\`\n`;
    message += `├ Reset Day : \`${this.saleService.resetDate()}\`\n`;
    message += `└ Timezone : \`${this.saleService.timezone()}\`\n\n`;

    await ctx.replyWithMarkdownV2(message, {
      disable_web_page_preview: true,
      reply_markup: keyboard.reply_markup,
    });
  }
}
