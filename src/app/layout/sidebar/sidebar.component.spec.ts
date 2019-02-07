/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs';
import { TutorialService } from '../../core/tutorial/tutorial.service';
import { User } from '../../core/user/user';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { MessageService } from '../../core/message/message.service';
import { NgxPermissionsModule } from 'ngx-permissions';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [
        NgxPermissionsModule.forRoot()
      ],
      providers: [
        TutorialService,
        {
          provide: UserService, useValue: {
          logout() {
          },
          me(): Observable<User> {
            return Observable.of(MOCK_USER);
          },
          isProfessional() {
            return Observable.of(true);
          },
          hasPerm() {
            return Observable.of(true);
          }
        },
        },
        {
          provide: MessageService, useValue: {
          totalUnreadMessages$: Observable.of(1)
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    spyOn(userService, 'me').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call userService.me', () => {
      expect(userService.me).toHaveBeenCalled();
    });
    it('should set the private user variable with the content of the user', () => {
      expect(component.user).toBe(MOCK_USER);
    });

    it('should call isProfessional and set the attribute', () => {
      spyOn(userService, 'isProfessional').and.callThrough();

      component.ngOnInit();

      expect(userService.isProfessional).toHaveBeenCalled();
      expect(component.isProfessional).toBe(true);
    });

    it('should call hasPerm and set the attribute', () => {
      spyOn(userService, 'hasPerm').and.callThrough();

      component.ngOnInit();

      expect(userService.hasPerm).toHaveBeenCalledWith('coins');
      expect(component.withCoins).toBe(true);
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
