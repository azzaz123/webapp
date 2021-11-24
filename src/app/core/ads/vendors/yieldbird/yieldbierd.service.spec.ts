import { TestBed } from '@angular/core/testing';
import { random } from 'faker';
import { YieldBirdService } from './yieldbird.service';

describe('YieldBirdService', () => {
  let service: YieldBirdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YieldBirdService],
    });
    service = TestBed.inject(YieldBirdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
