import { Hears, Start, Update, Ctx, Sender } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
// import { posts } from '@prisma/client';
import { format, utcToZonedTime } from 'date-fns-tz';
import { nextFriday, nextSaturday } from 'date-fns';
import { id } from 'date-fns/locale';

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
    const zonedDate = utcToZonedTime(new Date(), 'Asia/Jakarta', {
      timeZone: 'Asia/Jakarta',
    });
    const now = format(zonedDate, 'EEEE, dd MMMM yyyy \\- HH:mm z', {
      locale: id,
    });
    const sale_day = format(nextFriday(zonedDate), 'EEEE, dd MMMM yyyy', {
      locale: id,
    });
    const reset_day = format(nextSaturday(zonedDate), 'EEEE, dd MMMM yyyy', {
      locale: id,
    });
    const timezone = format(zonedDate, 'zzzz (O)', {
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
    message += `Hello *${firstName}${lastName ? ' ' + lastName : ''}*, I'm [telegram\\-sale\\-bot](https://github.com/dodyagung/telegram-sale-bot)\\. Now is *${now}*, what can I help you today?\n\n`;

    message += `*Sale Time*\n`;
    message += `├ Sale Day : \`${sale_day}\`\n`;
    message += `├ Reset Day : \`${reset_day}\`\n`;
    message += `└ Timezone : \`${timezone}\`\n\n`;

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
