import { RegisterInfo } from './register-info';

export interface LoginResponse {
  expirationDate: string;
  registerInfo: RegisterInfo;
  idUser: number;
  justRegistered: boolean;
  userId: number;
  userUUID: string;
  resetToken: string;
  token: string;
}
