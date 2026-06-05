import { SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { config } from "./config";

export async function setupSwagger(app: INestApplication): Promise<void> {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
} 