import { Injectable } from '@nestjs/common';
import { posts } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SaleService {
  constructor(private prismaService: PrismaService) {}

  async mySale() {
    const a: posts | null = await this.prismaService.posts.findFirst({
      where: { id: Number(711) },
    });
    console.log(a?.post);
  }
}
