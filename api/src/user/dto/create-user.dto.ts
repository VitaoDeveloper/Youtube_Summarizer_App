import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Provider } from "../../../generated/prisma/client";

export class CreateUserDto {
    @ApiProperty({
        description: 'User name',
        example: 'Ricardo Matos',
        maxLength: 80, 
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'User email',
        example: 'rick.mc@gmail.com',
        format: "email",
        maxLength: 80,
    })
    @IsString()
    email: string;

    @ApiProperty({
        description: 'User password',
        format: 'password',
        example: '••••••••••'
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: 'User LLM API provider',
        example: 'OpenAI',
        maxLength: 80,
    })
    @IsString()
    llmProvider: Provider;

    @ApiProperty({
        description: 'User LLM API Key',
        example: 'llmy_qWlfaBRSWG65fsRvVLVHf6JxnjOnHu6UqpFS45fyUcuVk7OSEyl7yo6H',
    })
    @IsString()
    apiKey: string;
}
