import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuthLoginDto {
    @ApiProperty({
        description: 'User email',
        format: 'email',
        example: 'rick.mc@gmail.com'
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
}
