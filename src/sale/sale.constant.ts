import {
  nextFriday,
  nextMonday,
  nextSaturday,
  nextSunday,
  nextThursday,
  nextTuesday,
  nextWednesday,
  subDays,
  subWeeks,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { id } from 'date-fns/locale';

const CONF_LOCALE = { locale: id };
const CONF_TZ = 'Asia/Jakarta';
const CONF_TIME_FORMAT = 'HH:mm z';
const CONF_DATE_FORMAT_SHORT = 'EEEE, dd MMMM yyyy';
const CONF_DATE_FORMAT_LONG = `${CONF_DATE_FORMAT_SHORT} - ${CONF_TIME_FORMAT}`;
const CONF_TZ_FORMAT = 'zzzz (OOO)';
const CONF_NOW = () => new Date();

let CONF_RESET_DAY: () => Date;
switch (process.env.TELEGRAM_SALE_DAY) {
  case 'monday':
    CONF_RESET_DAY = () => nextTuesday(CONF_NOW());
    break;
  case 'tuesday':
    CONF_RESET_DAY = () => nextWednesday(CONF_NOW());
    break;
  case 'wednesday':
    CONF_RESET_DAY = () => nextThursday(CONF_NOW());
    break;
  case 'thursday':
    CONF_RESET_DAY = () => nextFriday(CONF_NOW());
    break;
  case 'friday':
    CONF_RESET_DAY = () => nextSaturday(CONF_NOW());
    break;
  case 'saturday':
    CONF_RESET_DAY = () => nextSunday(CONF_NOW());
    break;
  case 'sunday':
    CONF_RESET_DAY = () => nextMonday(CONF_NOW());
    break;
  default:
    CONF_RESET_DAY = () => nextSaturday(CONF_NOW());
    break;
}

const CONF_RESET_DAY_MINUS_1_WEEK = () => subWeeks(CONF_RESET_DAY(), 1);
const CONF_SALE_DAY = () => subDays(CONF_RESET_DAY(), 1);

export const TODAY_TIME = () =>
  formatInTimeZone(CONF_NOW(), CONF_TZ, CONF_TIME_FORMAT, CONF_LOCALE);

export const TODAY_LONG = () =>
  formatInTimeZone(CONF_NOW(), CONF_TZ, CONF_DATE_FORMAT_LONG, CONF_LOCALE);

export const TODAY_SHORT = () =>
  formatInTimeZone(CONF_NOW(), CONF_TZ, CONF_DATE_FORMAT_SHORT, CONF_LOCALE);

export const SALE_DAY = () =>
  formatInTimeZone(
    CONF_SALE_DAY(),
    CONF_TZ,
    CONF_DATE_FORMAT_SHORT,
    CONF_LOCALE,
  );

export const RESET_DAY = () =>
  formatInTimeZone(
    CONF_RESET_DAY(),
    CONF_TZ,
    CONF_DATE_FORMAT_SHORT,
    CONF_LOCALE,
  );

export const RESET_DAY_MINUS_1_WEEK = () =>
  formatInTimeZone(
    CONF_RESET_DAY_MINUS_1_WEEK(),
    CONF_TZ,
    CONF_DATE_FORMAT_SHORT,
    CONF_LOCALE,
  );

export const TIMEZONE = () =>
  formatInTimeZone(CONF_NOW(), CONF_TZ, CONF_TZ_FORMAT, CONF_LOCALE);

export const NOW = CONF_NOW;

export const FALLBACK_MESSAGE =
  '**Wrong input, invalid command or something error.**\n\nPlease restart by clicking /start.';

export const NO_GROUP_MESSAGE = `**You can't send me a "start" command in a group.**\n\nPlease send it via [my private chat](tg://user?id=${process.env.TELEGRAM_SALE_BOT_TOKEN!.split(':')[0]}).`;
