import { Scene, SceneEnter, Ctx, Action, Hears, Start } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from '../../sale.common';
import { SaleService } from '../../sale.service';

@Scene('SALE_SCENE')
export class SaleScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const all_sales = await this.saleService.getSalesSortedByText(
      ctx.from!.id.toString(),
    );
    const enabled_sales = all_sales.filter((sale) => sale.is_enabled === true);
    const disabled_sales = all_sales.filter(
      (sale) => sale.is_enabled === false,
    );

    const keyboard = [[Markup.button.callback('➕ Add', 'add')]];
    if (all_sales.length !== 0) {
      keyboard.push(
        [
          Markup.button.callback('✏️ Edit', 'edit'),
          Markup.button.callback('🔄 Enable/Disable', 'toggle'),
        ],
        [Markup.button.callback('❌ Delete', 'delete')],
      );
    }
    keyboard.push([Markup.button.callback('👈 Back', 'back')]);

    let message = `💰 **Manage Sale**\n\n`;

    message += `Here you can manage your Sale.\n\n`;

    message += `**Sale**\n`;
    message += `├ Enabled : \`${enabled_sales.length}\`\n`;
    message += `├ Disabled : \`${disabled_sales.length}\`\n`;
    message += `└ Total : \`${all_sales.length}\`\n\n`;

    message += `Below is the actual view that will be sent to the group.\n\n`;

    message += `💰 Dody\n`;
    if (enabled_sales.length > 0) {
      enabled_sales.forEach((sale, index) => {
        if (index + 1 !== enabled_sales.length) {
          message += `├ ${sale.post.replace(/\n/g, ' ')}\n`;
        } else {
          message += `└ ${sale.post.replace(/\n/g, ' ')}\n`;
        }
      });
    } else {
      message += `└ _(No data or no enabled sale)_`;
    }

    sendMessageWithKeyboard(
      ctx,
      message,
      keyboard,
      (ctx.scene.state as any).edit_message,
    );
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }

  @Action('add')
  onAdd(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_ADD_SCENE');
  }

  @Action('edit')
  onEdit(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_EDIT_SCENE');
  }

  @Action('toggle')
  onTOggle(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_TOGGLE_SCENE');
  }

  @Action('delete')
  onDelete(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_DELETE_SCENE');
  }

  @Start()
  onStart(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }
}
