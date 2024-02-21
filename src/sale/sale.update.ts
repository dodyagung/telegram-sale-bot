import { Hears, Start, Update, Ctx, Sender } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { format, nextFriday } from 'date-fns';
import { id } from 'date-fns/locale';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { posts } from '@prisma/client';

@Update()
export class SaleUpdate {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

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

    let message = `*🏠 Welcome*\n\n`;
    message += `Hello *${firstName}${lastName ? ' ' + lastName : ''}*, I'm [telegram\\-sale\\-bot](https://github.com/dodyagung/telegram-sale-bot)\\. Now is *${today}*, what can I help you today?\n\n`;
    // message += this.configService.get<string>('TELEGRAM_SALE_BOT_DAY_SALE');
    message += format(
      nextFriday(new Date()),
      "EEEE, dd MMMM yyyy '\\-' HH:mm 'WIB'",
      {
        locale: id,
      },
    );

    // const a: posts | null = await this.prismaService.posts.findFirst({
    //   where: { id: Number(711) },
    // });
    // console.log(a?.post);

    await ctx.replyWithMarkdownV2(message, {
      disable_web_page_preview: true,
      reply_markup: keyboard.reply_markup,
    });
  }
}
