import { FUNCTIONAL_WEBAPP_SUBDOMAIN } from '@configs/subdomains.config';
import { environment } from '@environments/environment.beta';

const SUBDOMAIN: FUNCTIONAL_WEBAPP_SUBDOMAIN = 'es';

export const MOCK_SITE_URL = `${environment.protocol}${SUBDOMAIN}${environment.appDomain}`;
