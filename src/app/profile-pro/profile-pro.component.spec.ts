import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProComponent } from './profile-pro.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_USER, USER_URL, USER_WEB_SLUG } from '../../tests/user.fixtures.spec';
import { UserService } from '../core/user/user.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

describe('ProfileProComponent', () => {
  let component: ProfileProComponent;
  let fixture: ComponentFixture<ProfileProComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProComponent ],
      providers: [
        {
          provide: UserService, useValue: {
          me() {
            return Observable.of(MOCK_USER);
          },
          logout() {
          }
        }
        },
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    spyOn(userService, 'me').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {

    it('should call userService.me', () => {
      expect(userService.me).toHaveBeenCalled();
    });

    it('should set userUrl', () => {
      expect(component.userUrl).toBe(environment.siteUrl.replace('es', 'www') + 'user/' + USER_WEB_SLUG);
    });
  });

  describe('logout', () => {
    const preventDefault = jasmine.createSpy('preventDefault');
    const event = {preventDefault: preventDefault};

    beforeEach(() => {
      spyOn(userService, 'logout');
      component.logout(event);
    });

    it('should prevent event', () => {
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should logout', () => {
      expect(userService.logout).toHaveBeenCalled();
    });
  });
});
