import { Scene, SceneEnter, Ctx, Action, Hears } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from '../../sale.common';
import { SaleService } from '../../sale.service';

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

    const all_posts = await this.saleService.getPosts(ctx.from!.id.toString());
    const enabled_posts = all_posts.filter((post) => post.is_enabled === true);
    const disabled_posts = all_posts.filter(
      (post) => post.is_enabled === false,
    );

    message += `*Sale Post*\n`;
    message += `├ Enabled : \`${enabled_posts.length}\`\n`;
    message += `├ Disabled : \`${disabled_posts.length}\`\n`;
    message += `└ Total : \`${all_posts.length}\`\n\n`;

    message += `Below is the actual view that will be sent to the group\\.\n\n`;

    message += `💰 Dody\n`;
    if (enabled_posts.length > 0) {
      enabled_posts.forEach((post, index) => {
        if (index + 1 !== enabled_posts.length) {
          message += `├ ${post.post}\n`;
        } else {
          message += `└ ${post.post}\n`;
        }
      });
    } else {
      message += `└ _\\(No data or no enabled post\\)_`;
    }

    sendMessageWithKeyboard(ctx, message, keyboard);
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

  @Action('delete')
  onDelete(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_DELETE_SCENE');
  }
  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }
}
