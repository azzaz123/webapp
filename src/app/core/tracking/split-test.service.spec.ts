import { TestBed } from '@angular/core/testing';
import { SplitTestService } from './split-test.service';
import { SplitTestUserInfo } from './split-test.interface';

describe('SplitTestService', () => {

  let service: SplitTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SplitTestService]
    });
    service = TestBed.get(SplitTestService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

});
