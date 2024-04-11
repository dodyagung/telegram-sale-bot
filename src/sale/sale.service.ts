import { Injectable } from '@nestjs/common';
import { users } from '@prisma/client';
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

  async countPost(id: string): Promise<{ enabled: number; disabled: number }> {
    return {
      enabled: await this.prismaService.posts.count({
        where: { user_id: id, is_enabled: true },
      }),
      disabled: await this.prismaService.posts.count({
        where: { user_id: id, is_enabled: false },
      }),
    };
  }

  async createOrUpdateUser(user: users): Promise<void> {
    await this.prismaService.users.upsert({
      where: { id: user.id },
      update: {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        updated_at: user.updated_at,
      },
      create: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  }

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
