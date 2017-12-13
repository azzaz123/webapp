import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { User, USER_DATA } from 'shield';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';

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
  USER_DATA.web_slug,
  USER_DATA.first_name,
  USER_DATA.last_name,
  USER_DATA.birth_date,
  USER_DATA.gender
);

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgbButtonsModule
      ],
      providers: [
        {
          provide: UserService, useValue: {
          me() {
            return Observable.of(MOCK_USER);
          }
        }
        },
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        }
      ],
      declarations: [ ProfileComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
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
    it('should set userUrl', () => {
      expect(component.userUrl).toBe('https://www.wallapop.com/user/webslug-l1kmzn82zn3p');
    });
    it('should set profileForm with user data', () => {
      expect(component.profileForm.get('first_name').value).toBe(USER_DATA.first_name);
      expect(component.profileForm.get('last_name').value).toBe(USER_DATA.last_name);
      expect(component.profileForm.get('birth_date').value).toBe('1987-02-10');
      expect(component.profileForm.get('gender').value).toBe('M');
    });
  });
});
