import { TestBed, inject } from '@angular/core/testing';
import { TEST_HTTP_PROVIDERS } from 'shield';
import { GeolocationService } from './geolocation.service';

describe('GeolocationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeolocationService, ...TEST_HTTP_PROVIDERS]
    });
  });

  it('should be created', inject([GeolocationService], (service: GeolocationService) => {
    expect(service).toBeTruthy();
  }));
});
