import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
// import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { TODAY_ISO } from './sale.constant';

@Injectable()
export class SaleService {
  constructor(private prismaService: PrismaService) {}

  // @Cron('0 */4 * * * *') // every 4 minutes
  // async ping() {
  //   const ping = await this.prismaService.$queryRaw`select 1`;
  //   this.logger.log(`Database ping: ${JSON.stringify(ping)}`);
  // }

  async addSale(post: Prisma.postsUncheckedCreateInput): Promise<void> {
    await this.prismaService.posts.create({
      data: post,
    });
  }

  async getSales(
    user_id: string,
  ): Promise<{ id: number; is_enabled: boolean; post: string }[]> {
    return await this.prismaService.posts.findMany({
      select: { id: true, is_enabled: true, post: true },
      where: { user_id, is_deleted: false },
      orderBy: { updated_at: 'asc' },
    });
  }

  async getScheduledSales(): Promise<{ user_id: string; post: string }[]> {
    return await this.prismaService.users.findMany({
      where: {
        posts: {
          is_enabled: true,
        },
      },
      include: {
        posts: true,
      },
    });
    // return await this.prismaService.posts.findMany({
    //   select: { user_id: true, post: true },
    //   where: { is_enabled: true, is_deleted: false },
    //   orderBy: { updated_at: 'asc' },
    // });
  }

  async getSale(id: number): Promise<{ post: string } | null> {
    return await this.prismaService.posts.findFirst({
      select: { post: true },
      where: { id },
    });
  }

  async editSale(id: number, user_id: string, post: string): Promise<void> {
    await this.prismaService.posts.update({
      data: { post, updated_at: TODAY_ISO },
      where: { id, user_id },
    });
  }

  async toggleSale(
    id: number,
    user_id: string,
    is_enabled: boolean,
  ): Promise<void> {
    await this.prismaService.posts.update({
      data: { is_enabled, updated_at: TODAY_ISO },
      where: { id, user_id },
    });
  }

  async deleteSale(id: number, user_id: string): Promise<void> {
    await this.prismaService.posts.update({
      data: { is_deleted: true, updated_at: TODAY_ISO },
      where: { id, user_id },
    });
  }

  // async countPosts(
  //   user_id: string,
  // ): Promise<{ enabled: number; disabled: number }> {
  //   return {
  //     enabled: await this.prismaService.posts.count({
  //       where: { user_id, is_enabled: true, is_deleted: false },
  //     }),
  //     disabled: await this.prismaService.posts.count({
  //       where: { user_id, is_enabled: false, is_deleted: false },
  //     }),
  //   };
  // }

  async createOrUpdateUser(
    id: string,
    username: string,
    first_name: string,
    last_name: string,
  ): Promise<void> {
    await this.prismaService.users.upsert({
      where: { id },
      update: { username, first_name, last_name, updated_at: TODAY_ISO },
      create: {
        id,
        username,
        first_name,
        last_name,
        created_at: TODAY_ISO,
        updated_at: TODAY_ISO,
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
      data: { phone, updated_at: TODAY_ISO },
      where: { id },
    });
  }
}
