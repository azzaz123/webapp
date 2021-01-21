import { TestBed } from '@angular/core/testing';
import { LoadUserProfile, ProfileResolver } from '@data/user';
import { Store } from '@ngrx/store';

describe('ProfileResolver', () => {
  let resolver: ProfileResolver;
  let storeMock;

  beforeEach(() => {
    storeMock = {
      dispatch: () => {}
    }

    TestBed.configureTestingModule({
      providers: [ProfileResolver,
      {
        provide: Store,
        useValue: storeMock
      }]
    });

    resolver = TestBed.inject(ProfileResolver);
  });

  describe('resolve', () => {
    it('should emit event to load user profile', () => {
      spyOn(storeMock, 'dispatch').and.callThrough()

      resolver.resolve();

      expect(storeMock.dispatch).toBeCalledWith(LoadUserProfile())
    });
  });
});
