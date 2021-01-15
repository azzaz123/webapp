import { getTestBed } from '@angular/core/testing';
import { UserService } from '@core/user/user.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { of } from 'rxjs';

import { CheckUserPermissionsResolver } from './check-user-permissions.resolver';

describe('CheckUserPermissionsResolver', () => {
  let resolver: CheckUserPermissionsResolver;
  let userService: UserService;

  beforeEach(() => {
    const injector = getTestBed();
    injector.configureTestingModule({
      providers: [
        CheckUserPermissionsResolver,
        {
          provide: UserService,
          useClass: MockedUserService,
        },
      ],
    });
    resolver = injector.inject(CheckUserPermissionsResolver);
    userService = injector.inject(UserService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('when navigating to a private route', () => {
    it('should check user permissions', () => {
      spyOn(userService, 'checkUserPermissions').and.returnValue(of(true));

      resolver.resolve().subscribe(() => {
        expect(userService.checkUserPermissions).toHaveBeenCalledTimes(1);
      });
    });
  });
});
