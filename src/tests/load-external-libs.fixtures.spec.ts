import { of } from 'rxjs';

export const LOAD_EXTERNAL_LIBS_SERVICE_MOCK = {
  loadScriptBySource: (src: string | string[]) => of(null),
  loadScriptByText: (name: string, text: string) => of(null),
};
