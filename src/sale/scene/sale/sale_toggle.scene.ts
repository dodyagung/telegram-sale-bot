import { Scene, SceneEnter, Ctx, Action, Hears } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import {
  leaveScene,
  sendMessageWithKeyboard,
  sendMessageWithoutKeyboard,
} from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('SALE_TOGGLE_SCENE')
export class SaleToggleScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const all_posts = await this.saleService.getPosts(ctx.from!.id.toString());

    const keyboard = [];
    all_posts.forEach((post) => {
      keyboard.push([
        Markup.button.callback(
          `${post.is_enabled ? '🟢' : '🔴'} ${post.post}`,
          `toggle-post-${post.id}-${post.is_enabled}`,
        ),
      ]);
    });
    keyboard.push([Markup.button.callback('👈 Back', 'back')]);

    let message: string = `*🔄 Enable/Disable Sale*\n\n`;

    message += `Please click a sale post that you want to toggle enable or disable\\.\n\n`;
    message += `_🟢 \\= post is enabled_\n`;
    message += `_🔴 \\= post is disabled_`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action(/toggle-post-(\d+)-(true|false)/)
  async onPostToggle(@Ctx() ctx: SceneContext): Promise<void> {
    const id: number = +(ctx as any).match[1];
    const is_enabled: boolean = (ctx as any).match[2] === 'true';

    await this.saleService.togglePost(id, !is_enabled, ctx.from!.id.toString());

    ctx.scene.reenter();
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }
}
