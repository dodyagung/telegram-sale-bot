import { Hears, Start, Update, Ctx, On, Help, Sender } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
export class SaleUpdate {
  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async on(@Ctx() ctx: Context) {
    await ctx.reply('👍');
  }

  @Hears(['hi', 'hello', 'hey', 'qq'])
  async onGreetings(@Sender('first_name') firstName: string): Promise<string> {
    return `Hey ${firstName}`;
  }
}
