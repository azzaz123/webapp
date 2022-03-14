import { TestBed } from '@angular/core/testing';
import { PermissionsInitializerService } from './permissions-initializer.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { MockPermissionsService } from '@fixtures/permissions.fixtures';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { DEFAULT_PERMISSIONS, PERMISSIONS } from '@core/user/user-constants';

describe('PermissionsInitializerService', () => {
  let service: PermissionsInitializerService;
  let permissionsService: NgxPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NgxPermissionsService,
          useClass: MockPermissionsService,
        },
      ],
    });
    service = TestBed.inject(PermissionsInitializerService);
    permissionsService = TestBed.inject(NgxPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call addPermission with values for user', () => {
    spyOn(permissionsService, 'addPermission').and.returnValue({});

    service.setUserPermissions(MOCK_USER);

    expect(permissionsService.addPermission).toHaveBeenCalledWith(PERMISSIONS['normal']);
  });

  it('should call addPermission with default values', () => {
    spyOn(permissionsService, 'addPermission').and.returnValue({});

    service.setDefaultPermissions();

    expect(permissionsService.addPermission).toHaveBeenCalledWith(DEFAULT_PERMISSIONS);
  });
});
