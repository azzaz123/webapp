import { of } from 'rxjs';

export const LoadExternalLibsServiceMock = {
  loadScriptBySource: (src: string | string[]) => of(null),
  loadScriptByText: (name: string, text: string) => of(null),
};
