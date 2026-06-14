import { Markup, Telegram } from 'telegraf';
import { SceneContext } from 'telegraf/scenes';
import { FALLBACK_MESSAGE, NO_GROUP_MESSAGE } from './sale.constant';
import { InlineKeyboardButton } from 'telegraf/types';
import { ExtraEditMessageText } from 'node_modules/telegraf/typings/telegram-types';

type Hideable<B> = B & { hide?: boolean };
type HideableIKBtn = Hideable<InlineKeyboardButton>;
type MarkedModule = typeof import('marked');

// Keep the native dynamic import when SWC compiles the app to CommonJS.
const importEsm = new Function('specifier', 'return import(specifier)') as (
  specifier: string,
) => Promise<MarkedModule>;

const extraWithoutKeyboard = (): ExtraEditMessageText => {
  return {
    parse_mode: 'HTML',
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

const parse = async (message: string): Promise<string> => {
  const { marked } = await importEsm('marked');
  return await marked.parseInline(message);
};

export const isAllowedToStart = (ctx: SceneContext) =>
  ctx.message?.chat.type === 'private';

export const leaveScene = (ctx: SceneContext): void => {
  sendMessageWithoutKeyboard(
    ctx,
    isAllowedToStart(ctx) ? FALLBACK_MESSAGE : NO_GROUP_MESSAGE,
  );

  ctx.scene.leave();
};

export const sendMessageWithKeyboard = async (
  ctx: SceneContext,
  message: string,
  keyboard: HideableIKBtn[][],
  edit_message: boolean = true,
): Promise<void> => {
  await (ctx.callbackQuery && edit_message
    ? ctx.editMessageText(await parse(message), extraWithKeyboard(keyboard))
    : ctx.reply(await parse(message), extraWithKeyboard(keyboard)));
};

export const sendMessageWithoutKeyboard = async (
  ctx: SceneContext,
  message: string,
  edit_message: boolean = true,
): Promise<void> => {
  await (ctx.callbackQuery && edit_message
    ? ctx.editMessageText(await parse(message), extraWithoutKeyboard())
    : ctx.reply(await parse(message), extraWithoutKeyboard()));
};

export const sendMessageToGroup = async (
  bot: Telegram,
  group_id: string,
  message: string,
): Promise<void> => {
  await bot.sendMessage(group_id, await parse(message), extraWithoutKeyboard());
};
