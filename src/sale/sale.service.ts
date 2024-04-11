import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  async addPost(post: Prisma.postsUncheckedCreateInput): Promise<void> {
    await this.prismaService.posts.create({
      data: post,
    });
  }

  async getPosts(
    user_id: string,
  ): Promise<{ is_enabled: boolean; post: string }[]> {
    return await this.prismaService.posts.findMany({
      select: { post: true, is_enabled: true },
      where: { user_id, is_deleted: false },
      orderBy: { updated_at: 'asc' },
    });
  }

  async countPosts(
    user_id: string,
  ): Promise<{ enabled: number; disabled: number }> {
    return {
      enabled: await this.prismaService.posts.count({
        where: { user_id, is_enabled: true, is_deleted: false },
      }),
      disabled: await this.prismaService.posts.count({
        where: { user_id, is_enabled: false, is_deleted: false },
      }),
    };
  }

  async createOrUpdateUser(user: Prisma.usersCreateInput): Promise<void> {
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
