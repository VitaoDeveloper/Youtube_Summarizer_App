import { SwaggerCustomOptions } from "@nestjs/swagger";
import { DocumentBuilder } from "@nestjs/swagger";

export const config = new DocumentBuilder()
    .setTitle('Youtube Summarizer API')
    .setDescription('Command-line tool refactor. Now avaible as an API Service.')
    .setVersion('1.0')
    .build();

export const options: SwaggerCustomOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js',
  ],

}