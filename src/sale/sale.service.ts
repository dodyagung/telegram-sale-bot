import { Logger, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { posts } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SaleService {
  private readonly logger = new Logger(SaleService.name);

  constructor(private prismaService: PrismaService) {}

  // @Cron('0 */4 * * * *') // every 4 minutes
  // async ping() {
  //   const ping = await this.prismaService.$queryRaw`select 1`;
  //   this.logger.log(`Database ping: ${JSON.stringify(ping)}`);
  // }

  // async mySale() {
  //   const a: posts | null = await this.prismaService.posts.findFirst({
  //     where: { id: Number(711) },
  //   });
  //   console.log(a?.post);
  // }
}
