import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class ResetPasswordCallbackDto {
  @ApiProperty({
    description: 'The new password',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
