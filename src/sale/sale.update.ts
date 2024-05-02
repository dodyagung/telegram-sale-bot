import { Start, Update, Ctx, InjectBot } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { SaleService } from './sale.service';
import { Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import {
  RESET_DAY,
  RESET_DAY_MINUS_1_WEEK,
  SALE_DAY,
  TODAY,
  TODAY_SHORT,
} from './sale.constant';
import { Context, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { sendMessageToGroup } from './sale.common';
import { subWeeks } from 'date-fns';

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

  @Cron(CronExpression.EVERY_HOUR)
  async saleDayScheduler() {
    if (TODAY_SHORT === SALE_DAY) {
      this.logger.log('Running sale day scheduler');
      const users = await this.saleService.getUsersWithScheduledSales();

      let message = `🔥 **Today Hot Sale**\n\n`;
      message += `It's **${TODAY}**. Want to join the sale? [Chat me!](tg://user?id=${this.configService.get<string>('TELEGRAM_SALE_BOT_TOKEN')!.split(':')[0]})\n\n`;

      users.forEach((user) => {
        message += `💰 [${user.first_name}](tg://user?id=${user.id}) ${user.phone ? `(\`${user.phone}\`)` : ``}\n`;

        user.posts.forEach((post, index) => {
          if (index + 1 !== user.posts.length) {
            message += `├ ${post.post.replace(/\n/g, ' ')}\n`;
          } else {
            message += `└ ${post.post.replace(/\n/g, ' ')}\n`;
          }
        });

        message += `\n`;
      });

      sendMessageToGroup(
        this.bot.telegram,
        this.configService.get<string>('TELEGRAM_GROUP_ID')!,
        message,
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetDayScheduler() {
    if (TODAY_SHORT === RESET_DAY_MINUS_1_WEEK) {
      this.logger.log('Running reset day scheduler');
      // await this.saleService.disableAllEnabledPosts();
    }
  }
}
