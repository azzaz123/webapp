import { Observable, of } from 'rxjs';

export class HereMapServiceMock {
  public isLibraryLoading$(): Observable<boolean> {
    return of(false);
  }
  public platform = {
    createDefaultLayers() {
      return {
        normal: {
          map: 'map',
        },
      };
    },
  };

  public initScript(): Observable<boolean> {
    return of(true);
  }
}
