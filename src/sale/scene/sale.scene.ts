import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { sendMessage } from '../sale.common';

@Scene('SALE_SCENE')
export class SaleScene {
  @SceneEnter()
  onSceneEnter(@Ctx() ctx: SceneContext): void {
    const keyboard = [[Markup.button.callback('👈 Back', 'back')]];
    const message = ' sale scene';

    sendMessage(ctx, message, keyboard);
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }
}
