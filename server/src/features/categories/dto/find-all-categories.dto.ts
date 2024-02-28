import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class FindAllCategoriesDto {
  @ApiProperty({
    description: 'Sorting criteria',
    required: false,
  })
  @IsOptional()
  @IsIn(['categoryName', '-categoryName'])
  sort?: 'categoryName' | '-categoryName';

  userId: string;
}
