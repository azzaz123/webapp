import { TestBed } from '@angular/core/testing';
import { BumpTutorialService } from './bump-tutorial.service';
import { UserService } from '../../../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { MOCK_USER } from '../../../../tests/user.fixtures.spec';

describe('BumpTutorialService', () => {

  let service: BumpTutorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BumpTutorialService,
        {
          provide: UserService, useValue: {
          user: MOCK_USER,
          me() {
            return Observable.of(MOCK_USER);
          }
        }
        }
      ]
    });
    service = TestBed.get(BumpTutorialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
