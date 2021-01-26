import { HasUrl } from './has-url.interface';

export interface EmailShare extends HasUrl {
  subject: string;
  message: string;
}
