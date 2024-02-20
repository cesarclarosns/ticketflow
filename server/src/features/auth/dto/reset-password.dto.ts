import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class ResetPasswordDto {
  @ApiProperty({
    description: "The user's email",
  })
  @IsEmail()
  email: string
}
