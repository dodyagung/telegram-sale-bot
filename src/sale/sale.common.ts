import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';
import { SceneContext } from 'telegraf/scenes';
import { FALLBACK_MESSAGE } from './sale.constant';

type Hideable<B> = B & { hide?: boolean };
type HideableIKBtn = Hideable<InlineKeyboardButton>;

const extraWithoutKeyboard = (): ExtraEditMessageText => {
  return {
    parse_mode: 'MarkdownV2',
    link_preview_options: {
      is_disabled: true,
    },
  };
};

const extraWithKeyboard = (
  keyboard: HideableIKBtn[][],
): ExtraEditMessageText => {
  return Object.assign(extraWithoutKeyboard(), {
    reply_markup: Markup.inlineKeyboard(keyboard).reply_markup,
  });
};

export const leaveScene = (ctx: SceneContext): void => {
  sendMessageWithoutKeyboard(ctx, FALLBACK_MESSAGE);
  ctx.scene.leave();
};

export const sendMessageWithKeyboard = async (
  ctx: SceneContext,
  message: string,
  keyboard: HideableIKBtn[][],
  edit_message: boolean = true,
): Promise<void> => {
  await (ctx.callbackQuery && edit_message
    ? ctx.editMessageText(message, extraWithKeyboard(keyboard))
    : ctx.reply(message, extraWithKeyboard(keyboard)));
};

export const sendMessageWithoutKeyboard = async (
  ctx: SceneContext,
  message: string,
): Promise<void> => {
  await ctx.reply(message, extraWithoutKeyboard());
};
