import { nextTuesday, nextWednesday, subDays } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { id } from 'date-fns/locale';

const CONF_LOCALE = { locale: id };
const CONF_TZ = 'Asia/Jakarta';
const CONF_DATE_FORMAT_SHORT = 'EEEE, dd MMMM yyyy';
const CONF_DATE_FORMAT_LONG = 'EEEE, dd MMMM yyyy \\- HH:mm z';
const CONF_TZ_FORMAT = 'zzzz (OOO)';

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
  subDays(nextWednesday(new Date()), 1),
  CONF_TZ,
  CONF_DATE_FORMAT_SHORT,
  CONF_LOCALE,
);

export const RESET_DAY = formatInTimeZone(
  nextWednesday(new Date()),
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
  'Wrong input, invalid command or something error\\.\n\nPlease restart by clicking /start\\.';
