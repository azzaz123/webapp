import { TestBed } from '@angular/core/testing';

import { MonitoringService, SENTRY_DSN, TRACES_SAMPLE_RATE, WALLAPOP_DOMAIN_REGEX } from './monitoring.service';
import * as Sentry from '@sentry/angular';
import { environment } from '@environments/environment';

jest.mock('@sentry/angular', () => ({
  init: () => {},
}));

describe('MonitoringService', () => {
  let service: MonitoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitoringService);
  });

  describe('when the environment is not production', () => {
    it('should not initialize Sentry', () => {
      spyOn(Sentry, 'init');
      environment.production = false;

      service.initialize();

      expect(Sentry.init).not.toHaveBeenCalled();
    });
  });

  describe('when the environment is production', () => {
    const MOCK_SENTRY_CONFIG = {
      environment: expect.anything(),
      dsn: expect.anything(),
      tracesSampleRate: expect.anything(),
      allowUrls: expect.anything(),
    };

    beforeEach(() => {
      spyOn(Sentry, 'init');
      environment.production = true;

      service.initialize();
    });

    it('should initialize Sentry with valid Data Source Name (DSN)', () => {
      expect(Sentry.init).toHaveBeenCalledWith({
        ...MOCK_SENTRY_CONFIG,
        dsn: SENTRY_DSN,
      });
    });

    it('should send only a 10% of the generated transactions (errors, exceptions...)', () => {
      expect(Sentry.init).toHaveBeenCalledWith({
        ...MOCK_SENTRY_CONFIG,
        tracesSampleRate: TRACES_SAMPLE_RATE,
      });
    });

    it('should send only events that are generated inside the *.wallapop.com domain', () => {
      expect(Sentry.init).toHaveBeenCalledWith({
        ...MOCK_SENTRY_CONFIG,
        allowUrls: [WALLAPOP_DOMAIN_REGEX],
      });
    });

    it('should send the environment name as a configuration property', () => {
      expect(Sentry.init).toHaveBeenCalledWith({
        ...MOCK_SENTRY_CONFIG,
        environment: environment.name,
      });
    });
  });
});
