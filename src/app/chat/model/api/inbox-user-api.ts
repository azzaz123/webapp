import { InboxLocationApi } from './inbox-location-api';

export class InboxUserApi {
  hash: string;
  name: string;
  image_url: string;
  available: boolean;
  blocked: boolean;
  score: number;
  location: InboxLocationApi;
  response_rate: string;
  slug: string;
  malicious: boolean;
}
