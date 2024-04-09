import { nextFriday, nextSaturday } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { id } from 'date-fns/locale';

const CONF_LOCALE = id;
const CONF_TZ = 'Asia/Jakarta';
const CONF_DATE_FORMAT_SHORT = 'EEEE, dd MMMM yyyy';
const CONF_DATE_FORMAT_LONG = 'EEEE, dd MMMM yyyy \\- HH:mm z';
const CONF_TZ_FORMAT = 'zzzz (O)';
const CONF_TIME = utcToZonedTime(new Date(), CONF_TZ);
const CONF_TZ_OPTION = {
  locale: CONF_LOCALE,
  timeZone: CONF_TZ,
};

export const TODAY = format(CONF_TIME, CONF_DATE_FORMAT_LONG, CONF_TZ_OPTION);
export const SALE_DAY = format(
  nextFriday(CONF_TIME),
  CONF_DATE_FORMAT_SHORT,
  CONF_TZ_OPTION,
);
export const RESET_DAY = format(
  nextSaturday(CONF_TIME),
  CONF_DATE_FORMAT_SHORT,
  CONF_TZ_OPTION,
);
export const TIMEZONE = format(CONF_TIME, CONF_TZ_FORMAT, CONF_TZ_OPTION);
export const FALLBACK_MESSAGE =
  'Wrong input, invalid command or something error.\n\nPlease restart by clicking /start.';
