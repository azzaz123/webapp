import { SUBDOMAIN } from '@configs/subdomains.config';
import { environment } from '@environments/environment.beta';

const SUBDOMAIN: SUBDOMAIN = 'es';

export const MOCK_SITE_URL = `${environment.protocol}${SUBDOMAIN}${environment.appDomain}`;
