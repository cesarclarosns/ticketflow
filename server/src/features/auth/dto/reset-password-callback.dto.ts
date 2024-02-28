import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordCallbackDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
