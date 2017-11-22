/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { UserService } from '../../core/user/user.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        {
          provide: UserService, useValue: {
          logout() {
          }
        },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.get(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    beforeEach(() => {
      spyOn(userService, 'logout');
      component.logout();
    });
    it('should logout', () => {
      expect(userService.logout).toHaveBeenCalled();
    });
  });
});
