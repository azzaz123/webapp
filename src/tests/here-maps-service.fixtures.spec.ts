import { Observable, of } from 'rxjs';

export class HereMapServiceMock {
  public platform = {
    createDefaultLayers() {
      return {
        normal: {
          map: 'map',
        },
      };
    },
  };

  public isLibraryLoading$(): Observable<boolean> {
    return of(false);
  }

  public initScript(): Observable<boolean> {
    return of(true);
  }
}
