/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { UserService } from '../../core/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';
import { Observable } from 'rxjs/Observable';
import { User, USER_DATA } from 'shield';

const MOCK_USER = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online,
  USER_DATA.type,
  USER_DATA.received_reports,
  USER_DATA.web_slug
);

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let userService: UserService;
  let modalService: NgbModal;
  let componentInstance: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        {
          provide: UserService, useValue: {
          logout() {
          },
          me(): Observable<User> {
            return Observable.of(MOCK_USER);
          }
        },
        },
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              componentInstance: componentInstance
            };
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
    userService = TestBed.get(UserService);
    modalService = TestBed.get(NgbModal);
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
    it('should set userUrl', () => {
      expect(component.userUrl).toBe('https://www.wallapop.com/user/webslug-l1kmzn82zn3p');
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

  describe('openProfileModal', () => {
    const preventDefault = jasmine.createSpy('preventDefault');
    const event = {preventDefault: preventDefault};

    it('should prevent event', () => {
      component.openProfileModal(event);

      expect(preventDefault).toHaveBeenCalled();
    });

    it('should open modal', () => {
      spyOn(modalService, 'open').and.callThrough();
      component.userUrl = 'url';

      component.openProfileModal(event);

      expect(modalService.open).toHaveBeenCalledWith(ProfileModalComponent, {windowClass: 'profile'});
      expect(componentInstance.userUrl).toBe('url');
    });
  });
});
