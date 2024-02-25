import { Injectable } from '@nestjs/common';
import { format } from 'date-fns-tz';
import { nextFriday, nextSaturday } from 'date-fns';
import {
  FORMAT_LONG,
  FORMAT_SHORT,
  FORMAT_TIMEZONE,
  TIME_ZONED,
  TIMEZONE_OPTION,
} from './sale.constant';

@Injectable()
export class SaleService {
  today() {
    return format(TIME_ZONED, FORMAT_LONG, TIMEZONE_OPTION);
  }

  saleDate() {
    return format(nextFriday(TIME_ZONED), FORMAT_SHORT, TIMEZONE_OPTION);
  }

  resetDate() {
    return format(nextSaturday(TIME_ZONED), FORMAT_SHORT, TIMEZONE_OPTION);
  }

  timezone() {
    return format(TIME_ZONED, FORMAT_TIMEZONE, TIMEZONE_OPTION);
  }
}
