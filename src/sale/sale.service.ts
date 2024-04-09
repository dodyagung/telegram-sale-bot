import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SaleService {
  constructor(private prismaService: PrismaService) {}

  // @Cron('0 */4 * * * *') // every 4 minutes
  // async ping() {
  //   const ping = await this.prismaService.$queryRaw`select 1`;
  //   this.logger.log(`Database ping: ${JSON.stringify(ping)}`);
  // }

  async getPhone(id: string): Promise<{ phone: string | null } | null> {
    return await this.prismaService.users.findFirst({
      select: { phone: true },
      where: { id },
    });
  }

  async editPhone(id: string, phone: string | null): Promise<void> {
    await this.prismaService.users.update({
      data: { phone },
      where: { id },
    });
  }
}
