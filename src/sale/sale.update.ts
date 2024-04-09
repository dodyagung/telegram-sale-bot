import { Hears, Start, Update, Ctx } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';

@Update()
export class SaleUpdate {
  @Start()
  onStart(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }

  @Hears(/.+/)
  onFallback(): string {
    return 'Wrong input, invalid command or something error.\n\nPlease restart by clicking /start.';
  }
}
