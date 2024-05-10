import { Start, Update, Ctx, InjectBot, Hears } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { SaleService } from './sale.service';
import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  RESET_DAY_MINUS_1_WEEK,
  SALE_DAY,
  TODAY_LONG,
  TODAY_SHORT,
  TODAY_TIME,
} from './sale.constant';
import { Context, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import {
  isAllowedToStart,
  leaveScene,
  sendMessageToGroup,
} from './sale.common';

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
    if (isAllowedToStart(ctx)) {
      ctx.scene.enter('WELCOME_SCENE');
    } else {
      leaveScene(ctx);
    }
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async saleDayScheduler() {
    if (TODAY_SHORT() === SALE_DAY()) {
      this.logger.log(`Running sale day scheduler at ${TODAY_TIME()}`);
      const users = await this.saleService.getUsersWithScheduledSales();

      let messages: string[] = [];

      let index: number = 0;
      messages[index] = `🔥 **Today Hot Sale**\n\n`;
      messages[index] +=
        `It's **${TODAY_LONG()}**. Want to join the sale? [Chat me!](tg://user?id=${this.configService.get<string>('TELEGRAM_SALE_BOT_TOKEN')!.split(':')[0]})\n\n`;

      users.forEach((user) => {
        let new_message = `💰 [${user.first_name} ${user.last_name}](tg://user?id=${user.id}) ${user.phone ? `(\`${user.phone}\`)` : ``}\n`;

        user.posts.forEach((post, index) => {
          if (index + 1 !== user.posts.length) {
            new_message += `├ ${post.post.replace(/\n/g, ' ')}\n`;
          } else {
            new_message += `└ ${post.post.replace(/\n/g, ' ')}\n`;
          }
        });

        new_message += `\n`;

        // if previous and new message length is too long
        if ((messages[index] + new_message).length >= 4000) {
          // move to next array
          index++;
          // set empty string so it can be appended later
          messages[index] = '';
        }

        messages[index] += new_message;
      });

      messages.forEach((message) => {
        sendMessageToGroup(
          this.bot.telegram,
          this.configService.get<string>('TELEGRAM_GROUP_ID')!,
          message,
        );
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetDayScheduler() {
    if (TODAY_SHORT() === RESET_DAY_MINUS_1_WEEK()) {
      this.logger.log(`Running reset day scheduler at ${TODAY_TIME()}`);
      await this.saleService.disableAllEnabledPosts();
    }
  }
}
