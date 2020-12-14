import { of } from 'rxjs';

export const LOAD_EXTERNAL_LIBS_SERVICE_MOCK = {
  loadScript: (src: string | string[]) => of(null),
};
