import { Start, Update, Ctx } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { SaleService } from './sale.service';
import { Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { RESET_DAY, SALE_DAY, TODAY_SHORT } from './sale.constant';

@Update()
export class SaleUpdate {
  constructor(private saleService: SaleService) {}

  private readonly logger = new Logger(SaleUpdate.name);

  @Start()
  onStart(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }

  @Interval(5000)
  async handleCron() {
    // autopost to group
    if (TODAY_SHORT === SALE_DAY) {
      const sales = await this.saleService.getScheduledSales();

      console.log(sales);
    }

    // reset all post to disabled
    if (TODAY_SHORT === RESET_DAY) {
      this.logger.debug('reset');
    }
  }
}
