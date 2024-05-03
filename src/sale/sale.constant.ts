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
const CONF_DATE_FORMAT_SHORT = 'EEEE, dd MMMM yyyy';
const CONF_DATE_FORMAT_LONG = 'EEEE, dd MMMM yyyy - HH:mm z';
const CONF_TZ_FORMAT = 'zzzz (OOO)';
const CONF_NOW = () => new Date();

let CONF_SALE_DAY: () => Date;
let CONF_RESET_DAY: () => Date;
let CONF_RESET_DAY_MINUS_1_WEEK: () => Date;
switch (process.env.TELEGRAM_SALE_DAY) {
  case 'monday':
    CONF_SALE_DAY = () => subDays(nextTuesday(CONF_NOW()), 1);
    CONF_RESET_DAY = () => nextTuesday(CONF_NOW());
    CONF_RESET_DAY_MINUS_1_WEEK = () => subWeeks(nextTuesday(CONF_NOW()), 1);
    break;
  case 'tuesday':
    CONF_SALE_DAY = () => subDays(nextWednesday(CONF_NOW()), 1);
    CONF_RESET_DAY = () => nextWednesday(CONF_NOW());
    CONF_RESET_DAY_MINUS_1_WEEK = () => subWeeks(nextWednesday(CONF_NOW()), 1);
    break;
  case 'wednesday':
    CONF_SALE_DAY = () => subDays(nextThursday(CONF_NOW()), 1);
    CONF_RESET_DAY = () => nextThursday(CONF_NOW());
    CONF_RESET_DAY_MINUS_1_WEEK = () => subWeeks(nextThursday(CONF_NOW()), 1);
    break;
  case 'thursday':
    CONF_SALE_DAY = () => subDays(nextFriday(CONF_NOW()), 1);
    CONF_RESET_DAY = () => nextFriday(CONF_NOW());
    CONF_RESET_DAY_MINUS_1_WEEK = () => subWeeks(nextFriday(CONF_NOW()), 1);
    break;
  case 'friday':
    CONF_SALE_DAY = () => subDays(nextSaturday(CONF_NOW()), 1);
    CONF_RESET_DAY = () => nextSaturday(CONF_NOW());
    CONF_RESET_DAY_MINUS_1_WEEK = () => subWeeks(nextSaturday(CONF_NOW()), 1);
    break;
  case 'saturday':
    CONF_SALE_DAY = () => subDays(nextSunday(CONF_NOW()), 1);
    CONF_RESET_DAY = () => nextSunday(CONF_NOW());
    CONF_RESET_DAY_MINUS_1_WEEK = () => subWeeks(nextSunday(CONF_NOW()), 1);
    break;
  case 'sunday':
    CONF_SALE_DAY = () => subDays(nextMonday(CONF_NOW()), 1);
    CONF_RESET_DAY = () => nextMonday(CONF_NOW());
    CONF_RESET_DAY_MINUS_1_WEEK = () => subWeeks(nextMonday(CONF_NOW()), 1);
    break;
  default:
    CONF_SALE_DAY = () => subDays(nextSaturday(CONF_NOW()), 1);
    CONF_RESET_DAY = () => nextSaturday(CONF_NOW());
    CONF_RESET_DAY_MINUS_1_WEEK = () => subWeeks(nextSaturday(CONF_NOW()), 1);
    break;
}

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
  'Wrong input, invalid command or something error.\n\nPlease restart by clicking /start.';
