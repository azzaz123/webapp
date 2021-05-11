import { Route } from '@angular/router';

export interface ReusedRoute extends Route {
  data: {
    shouldReuseRoute: boolean;
    routeKey: string;
  };
}
