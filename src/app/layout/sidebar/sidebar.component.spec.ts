/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { UserService } from '../../core/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let userService: UserService;
  let modalService: NgbModal;

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
        {
          provide: NgbModal, useValue: {
          open() {
          }
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
    fixture.detectChanges();
    userService = TestBed.get(UserService);
    modalService = TestBed.get(NgbModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('should logout', () => {
      spyOn(userService, 'logout');

      component.logout();

      expect(userService.logout).toHaveBeenCalled();
    });
  });

  describe('openProfileModal', () => {
    const preventDefault = jasmine.createSpy('preventDefault');
    const event = {preventDefault: preventDefault};

    it('should prevent event', () => {
      component.openProfileModal(event);

      expect(preventDefault).toHaveBeenCalled();
    });

    it('should open modal', () => {
      spyOn(modalService, 'open');

      component.openProfileModal(event);

      expect(modalService.open).toHaveBeenCalledWith(ProfileModalComponent, {windowClass: 'profile'});
    });
  });
});
