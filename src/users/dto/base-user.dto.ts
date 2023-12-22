import { IsNotEmpty, MaxLength } from 'class-validator';
export class BaseUserDTO {
  @IsNotEmpty()
  @MaxLength(128)
  fullName: string;
  username?: string;
  first?: boolean;
  @IsNotEmpty()
  passport: string;
  password?: string;
  @IsNotEmpty()
  phoneNumber: string;
  @IsNotEmpty()
  address: string;
}
