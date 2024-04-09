import { Start, Update, Ctx } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';

@Update()
export class SaleUpdate {
  @Start()
  onStart(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }
}
