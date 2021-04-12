import { AccessMetadata } from './access-metadata';

export interface LoginRequest {
  emailAddress: string;
  password: string;
  metadata?: AccessMetadata;
}
