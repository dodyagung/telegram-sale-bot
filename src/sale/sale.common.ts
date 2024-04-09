import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';
import { SceneContext } from 'telegraf/scenes';
import { FALLBACK_MESSAGE } from './sale.constant';

type Hideable<B> = B & { hide?: boolean };
type HideableIKBtn = Hideable<InlineKeyboardButton>;

const extra = (keyboard: HideableIKBtn[][]): ExtraEditMessageText => {
  return {
    parse_mode: 'MarkdownV2',
    link_preview_options: {
      is_disabled: true,
    },
    reply_markup: Markup.inlineKeyboard(keyboard).reply_markup,
  };
};

export const leaveScene = (ctx: SceneContext): void => {
  sendMessageWithoutKeyboard(ctx, FALLBACK_MESSAGE);
  ctx.scene.leave();
};

export const sendMessageWithKeyboard = async (
  ctx: SceneContext,
  message: string,
  keyboard: HideableIKBtn[][],
): Promise<void> => {
  await (ctx.callbackQuery
    ? ctx.editMessageText(message, extra(keyboard))
    : ctx.reply(message, extra(keyboard)));
};

export const sendMessageWithoutKeyboard = (
  ctx: SceneContext,
  message: string,
): void => {
  ctx.reply(message);
};
