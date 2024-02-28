import { registerDecorator, ValidationOptions } from 'class-validator';
import { Types as MongooseTypes } from 'mongoose';

export function IsObjectId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isObjectId',
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: {
        validate(value: any) {
          return MongooseTypes.ObjectId.isValid(value);
        },
      },
    });
  };
}
