import { Inject, Injectable } from '@angular/core';
import { GoogleOptimize } from './optimize.interface';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { Variant } from '@core/experimentation/models';
import { mapExperimentationCodeToValueForOptimize } from '@core/experimentation/mappers/variant-mapper';

@Injectable({
  providedIn: 'root',
})
export class OptimizeService {
  get optimize(): GoogleOptimize {
    return this.window['google_optimize'];
  }

  constructor(@Inject(WINDOW_TOKEN) private window: Window) {}

  public getVariant(experimentId: string): Variant {
    return mapExperimentationCodeToValueForOptimize(+this.optimize.get(experimentId));
  }
}
