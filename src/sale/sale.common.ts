import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';
import { SceneContext } from 'telegraf/scenes';

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

export const sendMessage = async (
  ctx: SceneContext,
  message: string,
  keyboard: HideableIKBtn[][],
  new_message: boolean = false,
): Promise<void> => {
  await (new_message
    ? ctx.reply(message, extra(keyboard))
    : ctx.editMessageText(message, extra(keyboard)));
};
