import { utcToZonedTime } from 'date-fns-tz';
import { id } from 'date-fns/locale';

export const LOCALE = id;
export const TIMEZONE = 'Asia/Jakarta';
export const FORMAT_SHORT = 'EEEE, dd MMMM yyyy';
export const FORMAT_LONG = 'EEEE, dd MMMM yyyy \\- HH:mm z';
export const FORMAT_TIMEZONE = 'zzzz (O)';
export const TIME_ZONED = utcToZonedTime(new Date(), TIMEZONE);
export const TIMEZONE_OPTION = {
  locale: LOCALE,
  timeZone: TIMEZONE,
};
