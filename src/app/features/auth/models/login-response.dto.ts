import {GetUserDto} from '../../../shared/models/get-user.dto';

export interface LoginResponseDto{
  token: string;
  expiresIn: number,
  user: GetUserDto,
}
