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
import { posts } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SaleService {
  constructor(private prismaService: PrismaService) {}

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

  async mySale() {
    const a: posts | null = await this.prismaService.posts.findFirst({
      where: { id: Number(711) },
    });
    console.log(a?.post);
  }
}
