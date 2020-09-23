
import { of as observableOf, Observable } from 'rxjs';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { UserService } from '../../core/user/user.service';
import { TutorialService } from '../../core/tutorial/tutorial.service';
import { User } from '../../core/user/user';
import { MOCK_USER } from '../../../tests/user.fixtures.spec';
import { MessageService } from '../../chat/service/message.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkDirectiveStub } from 'app/shared/router-link-directive-stub';
import { By } from '@angular/platform-browser';

@Component({
  template: ''
})
export class MockComponent { }

const routes: Routes = [
  { path: 'profile', component: MockComponent },
  { path: 'pro/dashboard', component: MockComponent },
  { path: 'catalog/list', component: MockComponent },
  { path: 'wallacoins', component: MockComponent },
  { path: 'chat', component: MockComponent },
  { path: 'favorites', component: MockComponent },
  { path: 'reviews', component: MockComponent },
  { path: 'pro/calls', component: MockComponent },
  { path: 'pro/help', component: MockComponent },
  { path: 'pro/stats', component: MockComponent },
];

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let userService: UserService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent, RouterLinkDirectiveStub, MockComponent],
      imports: [
        NgxPermissionsModule.forRoot(),
        RouterTestingModule.withRoutes(routes)
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
    router = TestBed.get(Router);
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

  describe('Sidebar icons', () => {
    it('should be shown profile icon as "active" when is in a profile section', () => {
      component.isProfile = true;
      const element: HTMLElement = fixture.nativeElement.querySelector("#qa-sidebar-profile");

      component.ngOnInit();
      fixture.detectChanges();

      expect(element.className).toContain('active');
    });

    it('should be shown profile icon as "active" when is in profile url route', fakeAsync(() => {
      fixture.ngZone.run(() => {
        component.isProfile = false;
        router.navigate(['profile']);

        tick();
        var activeLinks = fixture.debugElement.queryAll(By.css('.active')).map(element => element.injector.get(RouterLinkDirectiveStub) as RouterLinkDirectiveStub);

        expect(activeLinks.length).toBe(1);
        expect(activeLinks[0].linkParams).toEqual(['/profile']);
      });
    }));

    it('should be shown catalog icon as "active" when it is in a product section', () => {
      component.isProducts = true;
      const element: HTMLElement = fixture.nativeElement.querySelector("#qa-sidebar-catalog");

      component.ngOnInit();
      fixture.detectChanges();

      expect(element.className).toContain('active');
    });

    it('should be shown chat icon as "active" when is in chat url route', fakeAsync(() => {
      fixture.ngZone.run(() => {
        router.navigate(['chat']);

        tick();
        var activeLinks = fixture.debugElement.queryAll(By.css('.active')).map(element => element.injector.get(RouterLinkDirectiveStub) as RouterLinkDirectiveStub);

        expect(activeLinks.length).toBe(1);
        expect(activeLinks[0].linkParams).toEqual(['/chat']);
      });
    }));
  });

});
