import { Scene, SceneEnter, Ctx, Action, Hears, Start } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from '../sale.common';

@Scene('TUTORIAL_SCENE')
export class TutorialScene {
  @SceneEnter()
  onSceneEnter(@Ctx() ctx: SceneContext): void {
    const keyboard = [[Markup.button.callback('👈 Back', 'back')]];

    let message: string = `**❓ Tutorial**\n\n`;
    message += `1. If you've **never** used this bot before, add a new Sale Post in **Manage Sale > Create New**.\n\n`;
    message += `2. If you've **already** used this bot before, re-activate your old Sale Post in **Manage Sale > Enable/Disable**. You can also Edit and Delete your Sale Post in **Manage Sale > Edit/Delete**.\n\n`;
    message += `3. Only enabled Sale Post is sent to the group (**hourly** at **Sale Day**).\n\n`;
    message += `4. Sale Post that has passed the Sell Day will become disabled automatically.\n\n`;
    message += `5. The actual view that will be sent to the group can be seen in **Manage Sale**.\n\n`;
    message += `6. If there are problems or errors, contact us on the About menu.`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
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
