import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get EnvV
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      // bloqua q pueda tener +@Args() x method - graphql ya se encarga de hacer estas validaciones
      // forbidNonWhitelisted: true,
    }),
  );

  await app.listen(PORT);
}
bootstrap();
