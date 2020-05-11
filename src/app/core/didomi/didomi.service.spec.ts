import { TestBed, getTestBed } from '@angular/core/testing';
import { DidomiService } from './didomi.service';

describe('Service: Didomi', () => {
  let injector: TestBed;
  let service: DidomiService;

  beforeEach(() => {
    injector = getTestBed();
    injector.configureTestingModule({});
    service = injector.inject(DidomiService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });
});
