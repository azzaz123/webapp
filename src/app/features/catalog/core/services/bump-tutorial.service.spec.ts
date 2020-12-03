import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { BumpTutorialService } from './bump-tutorial.service';
import { UserService } from '@core/user/user.service';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';

describe('BumpTutorialService', () => {
  let service: BumpTutorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BumpTutorialService,
        {
          provide: UserService,
          useValue: {
            user: MOCK_USER,
            me() {
              return of(MOCK_USER);
            },
            isProfessional() {
              return of(true);
            },
          },
        },
      ],
    });
    service = TestBed.inject(BumpTutorialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
