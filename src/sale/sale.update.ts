import { Hears, Start, Update, Ctx, Sender } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

@Update()
export class SaleUpdate {
  @Start()
  @Hears(['hi', 'hello', 'hey', 'qq', 'a'])
  async onGreetings(
    @Ctx() ctx: Context,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
  ): Promise<void> {
    const today = format(new Date(), "EEEE, dd MMMM yyyy '\\-' HH:mm 'WIB'", {
      locale: id,
    });

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

    const message = `
*🏠 Welcome*
      
Hello *${firstName}${lastName ? ' ' + lastName : ''}*, I'm [telegram\\-sale\\-bot](https://github.com/dodyagung/telegram-sale-bot)\\. Now is *${today}*, what can I help you today?
    `;

    await ctx.replyWithMarkdownV2(message, {
      disable_web_page_preview: true,
      reply_markup: keyboard.reply_markup,
    });
  }
}
