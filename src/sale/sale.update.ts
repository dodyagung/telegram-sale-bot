import { Start, Update, Ctx, InjectBot } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { SaleService } from './sale.service';
import { Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { RESET_DAY, SALE_DAY, TODAY, TODAY_SHORT } from './sale.constant';
import { Context, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { sendMessageToGroup } from './sale.common';

@Update()
export class SaleUpdate {
  constructor(
    private saleService: SaleService,
    private configService: ConfigService,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  private readonly logger = new Logger(SaleUpdate.name);

  @Start()
  onStart(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }

  @Interval(5000)
  async handleCron(@Ctx() ctx: Context) {
    // autopost to group
    // if (TODAY_SHORT === SALE_DAY) {
    //   const users = await this.saleService.getUsersWithScheduledSales();

    //   let message = `🔥 **Today Hot Sale**\n\n`;
    //   message += `It's **${TODAY}**. Want to join the sale? [Chat me!](tg://user?id=${this.configService.get<string>('TELEGRAM_SALE_BOT_TOKEN')!.split(':')[0]})\n\n`;

    //   users.forEach((user) => {
    //     message += `💰 [${user.first_name}](tg://user?id=${user.id}) ${user.phone ? `(\`${user.phone}\`)` : ``}\n`;

    //     user.posts.forEach((post, index) => {
    //       if (index + 1 !== user.posts.length) {
    //         message += `├ ${post.post.replace(/\n/g, ' ')}\n`;
    //       } else {
    //         message += `└ ${post.post.replace(/\n/g, ' ')}\n`;
    //       }
    //     });

    //     message += `\n`;
    //   });

    //   sendMessageToGroup(
    //     this.bot.telegram,
    //     this.configService.get<string>('TELEGRAM_GROUP_ID')!,
    //     message,
    //   );
    // }

    // reset all post to disabled
    if (TODAY_SHORT === RESET_DAY) {
      this.logger.debug('reset');
    }
  }
}
