import { TestBed } from '@angular/core/testing';
import { BumpTutorialService } from './bump-tutorial.service';

describe('BumpTutorialService', () => {

  let service: BumpTutorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BumpTutorialService
      ]
    });
    service = TestBed.get(BumpTutorialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});