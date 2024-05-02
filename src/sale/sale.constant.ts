import {
  nextFriday,
  nextMonday,
  nextSaturday,
  nextSunday,
  nextThursday,
  nextTuesday,
  nextWednesday,
  subDays,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { id } from 'date-fns/locale';

const CONF_LOCALE = { locale: id };
const CONF_TZ = 'Asia/Jakarta';
const CONF_DATE_FORMAT_SHORT = 'EEEE, dd MMMM yyyy';
const CONF_DATE_FORMAT_LONG = 'EEEE, dd MMMM yyyy - HH:mm z';
const CONF_TZ_FORMAT = 'zzzz (OOO)';

let CONF_SALE_DAY: Date;
let CONF_RESET_DAY: Date;
switch (process.env.TELEGRAM_SALE_DAY) {
  case 'monday':
    CONF_SALE_DAY = subDays(nextTuesday(new Date()), 1);
    CONF_RESET_DAY = nextTuesday(new Date());
    break;
  case 'tuesday':
    CONF_SALE_DAY = subDays(nextWednesday(new Date()), 1);
    CONF_RESET_DAY = nextWednesday(new Date());
    break;
  case 'wednesday':
    CONF_SALE_DAY = subDays(nextThursday(new Date()), 1);
    CONF_RESET_DAY = nextThursday(new Date());
    break;
  case 'thursday':
    CONF_SALE_DAY = subDays(nextFriday(new Date()), 1);
    CONF_RESET_DAY = nextFriday(new Date());
    break;
  case 'friday':
    CONF_SALE_DAY = subDays(nextSaturday(new Date()), 1);
    CONF_RESET_DAY = nextSaturday(new Date());
    break;
  case 'saturday':
    CONF_SALE_DAY = subDays(nextSunday(new Date()), 1);
    CONF_RESET_DAY = nextSunday(new Date());
    break;
  case 'sunday':
    CONF_SALE_DAY = subDays(nextMonday(new Date()), 1);
    CONF_RESET_DAY = nextMonday(new Date());
    break;
  default:
    CONF_SALE_DAY = subDays(nextSaturday(new Date()), 1);
    CONF_RESET_DAY = nextSaturday(new Date());
    break;
}

export const TODAY = formatInTimeZone(
  new Date(),
  CONF_TZ,
  CONF_DATE_FORMAT_LONG,
  CONF_LOCALE,
);

export const TODAY_SHORT = formatInTimeZone(
  new Date(),
  CONF_TZ,
  CONF_DATE_FORMAT_SHORT,
  CONF_LOCALE,
);

export const SALE_DAY = formatInTimeZone(
  CONF_SALE_DAY,
  CONF_TZ,
  CONF_DATE_FORMAT_SHORT,
  CONF_LOCALE,
);

export const RESET_DAY = formatInTimeZone(
  CONF_RESET_DAY,
  CONF_TZ,
  CONF_DATE_FORMAT_SHORT,
  CONF_LOCALE,
);

export const TIMEZONE = formatInTimeZone(
  new Date(),
  CONF_TZ,
  CONF_TZ_FORMAT,
  CONF_LOCALE,
);

export const FALLBACK_MESSAGE =
  'Wrong input, invalid command or something error.\n\nPlease restart by clicking /start.';
