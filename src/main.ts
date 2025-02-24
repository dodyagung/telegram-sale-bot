import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// https://github.com/telegraf/telegraf/issues/1961
import { setDefaultResultOrder } from 'node:dns';
setDefaultResultOrder('ipv6first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
