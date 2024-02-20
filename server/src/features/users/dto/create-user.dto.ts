import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsDateString,
} from 'class-validator'

import { EUserGender } from '@app/features/users/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(EUserGender)
  gender: string

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  birthday: string
}
