import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(getBotToken('sale'));
  app.use(bot.webhookCallback('/'));
  await app.listen(3000);
}
bootstrap();
