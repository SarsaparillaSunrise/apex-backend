import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MessageMessage, JoinMessage, QuitMessage, NickMessage, ActionMessage } from './logs/dto/messages.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('IRC Logs API')
    .setDescription('API for accessing IRC channel logs')
    .setVersion('1.0')
    .addTag('logs')
    .build();
    
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      MessageMessage,
      JoinMessage,
      QuitMessage,
      NickMessage,
      ActionMessage
    ]
  });
  
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'IRC Logs API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai'
      }
    }
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
