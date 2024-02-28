import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import mongoose from 'mongoose';

import { UsersService } from '@/features/users/users.service';

export function IsUserId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUserId',
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: IsUserIdValidatorConstraint,
    });
  };
}

@ValidatorConstraint({ async: true, name: 'IsUserIdValidatorConstraint' })
@Injectable()
export class IsUserIdValidatorConstraint
  implements ValidatorConstraintInterface
{
  constructor(private usersService: UsersService) {}

  async validate(value: string): Promise<boolean> {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) return false;

    const user = await this.usersService.findOneById(value);
    return Boolean(user);
  }
}
