import { DocumentBuilder } from "@nestjs/swagger";

export const config = new DocumentBuilder()
    .setTitle('Youtube Summarizer API')
    .setDescription('Command-line tool refactor. Now avaible as an API Service.')
    .setVersion('1.0')
    .build();