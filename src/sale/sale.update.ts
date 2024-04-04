import { Hears, Start, Update, Ctx } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';

@Update()
export class SaleUpdate {
  @Start()
  async onStart(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('WELCOME_SCENE');
  }

  @Hears(/.+/)
  async onFallback(): Promise<string> {
    return 'Wrong input, invalid command or something error.\n\nPlease restart by clicking /start.';
  }
}
