import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'
import { UsersService } from '@features/users/users.service'
import { Injectable } from '@nestjs/common'
import mongoose from 'mongoose'

export function IsUserId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUserId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUserIdValidatorConstraint,
    })
  }
}

@ValidatorConstraint({ name: 'IsUserIdValidatorConstraint', async: true })
@Injectable()
export class IsUserIdValidatorConstraint
  implements ValidatorConstraintInterface
{
  constructor(private usersService: UsersService) {}

  async validate(value: string): Promise<boolean> {
    const isValid = mongoose.Types.ObjectId.isValid(value)
    if (!isValid) return false

    return this.usersService.findOne(value).then((user) => {
      return Boolean(user)
    })
  }
}
