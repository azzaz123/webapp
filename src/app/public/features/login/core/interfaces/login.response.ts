export interface LoginResponse {
  extraInfo: {
    justRegistered: boolean;
  };
  resetToken: string;
  token: string;
}
