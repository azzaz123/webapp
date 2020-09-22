
import {of as observableOf,  Observable } from 'rxjs';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { UserService } from '../../core/user/user.service';
import { TutorialService } from '../../core/tutorial/tutorial.service';
import { User } from '../../core/user/user';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { MessageService } from '../../chat/service/message.service';
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
            return observableOf(MOCK_USER);
          },
          isProfessional() {
            return observableOf(true);
          }
        },
        },
        {
          provide: MessageService, useValue: {
          totalUnreadMessages$: observableOf(1)
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
    userService = TestBed.inject(UserService);
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
  });

  describe('css class', () => {
    it('should add class "active" in profile when isProfile is true', () => {
      component.isProfile = true;
      const element: HTMLElement = fixture.nativeElement.querySelector("#qa-sidebar-profile");

      component.ngOnInit();
      fixture.detectChanges();

      expect(element.className).toContain('active');
    });

    it('should add class "active" in catalog when isProducts is true', () => {
      component.isProducts = true;
      const element: HTMLElement = fixture.nativeElement.querySelector("#qa-sidebar-catalog");

      component.ngOnInit();
      fixture.detectChanges();

      expect(element.className).toContain('active');
    });
  });

});
