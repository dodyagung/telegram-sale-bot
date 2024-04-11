import { Scene, SceneEnter, Ctx, Action, Hears } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from '../sale.common';
import { SaleService } from '../sale.service';

@Scene('SALE_SCENE')
export class SaleScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [
      [
        Markup.button.callback('👈 Back', 'back'),
        Markup.button.callback('➕ Add', 'add'),
        Markup.button.callback('✏️ Edit', 'edit'),
        Markup.button.callback('❌ Delete', 'delete'),
      ],
    ];

    let message = `💰 Manage Sale\n\n`;

    message += `Here you can manage your Sale Post\\.\n\n`;

    console.log(ctx.from?.id.toString());
    console.log(await this.saleService.countPost(ctx.from!.id.toString()));

    const { ...post_count } = await this.saleService.countPost(
      ctx.from!.id.toString(),
    );

    message += `*Sale Post*\n`;
    message += `├ Enabled : \`${post_count.enabled}\`\n`;
    message += `├ Disabled : \`${post_count.disabled}\`\n`;
    message += `└ Total : \`${post_count.enabled + post_count.disabled}\`\n\n`;

    message += `Below is the actual view that will be sent to the group\\.\n\n`;

    message += `💰 Dody\n`;
    message += `└ \\(No data\\)`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }
}
