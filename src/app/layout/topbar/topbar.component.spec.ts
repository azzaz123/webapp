import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TopbarComponent } from './topbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../core/user/user.service';
import { USER_DATA, User, WindowRef } from 'shield';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../../core/event/event.service';
import { CATEGORY_DATA_WEB } from '../../../tests/category.fixtures';
import { environment } from '../../../environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TEST_HTTP_PROVIDERS } from 'shield';
import { SUGGESTER_DATA_WEB } from '../../../tests/suggester.fixtures';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadModalComponent } from './upload-modal/upload-modal.component';

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

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let userService: UserService;
  let fixture: ComponentFixture<TopbarComponent>;
  let eventService: EventService;
  let windowRef: WindowRef;
  let modalService: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: UserService, useValue: {
            me(): Observable<User> {
              return Observable.of(MOCK_USER);
            },
            logout() {
            }
          },
        },
        {
          provide: WindowRef, useValue: {
            nativeWindow: {
              location: {
                href: environment.siteUrl
              }
            }
          }
        },
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              result: Promise.resolve()
            };
          }
        }
        },
        EventService, ...TEST_HTTP_PROVIDERS],
      declarations: [TopbarComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
    userService = TestBed.get(UserService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    eventService = TestBed.get(EventService);
    windowRef = TestBed.get(WindowRef);
    modalService = TestBed.get(NgbModal);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the private user variable with the content of the user', () => {
      component.user = null;
      component.ngOnInit();
      expect(component.user).toBe(MOCK_USER);
    });
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

  describe('update coordinate', () => {
    let newCoordinates = {'lat': 41.2, 'lng': 2.1};
    it('should update the user coordinates', () => {
      component.coordinates = {'lat': 0.0, 'lng': 0.0};
      component.onCoordinateUpdate(newCoordinates);
      expect(component.coordinates).toEqual(newCoordinates);
    });
  });

  describe('update keyword', () => {
    let newKeyword = 'iphone';
    it('should update the keyword', () => {
      component.kws = 'iphone';
      component.onKeywordUpdate(newKeyword);
      expect(component.kws).toEqual(newKeyword);
    });
  });

  describe('search form', () => {
    beforeEach(() => {
      component.latEl = {
        nativeElement: {
          value: '42'
        }
      };
      component.lngEl = {
        nativeElement: {
          value: '2'
        }
      };
      component.kwsEl = {
        nativeElement: {
          value: 'iphone'
        }
      };
    });

    describe('update category', () => {
      it('should update the category and call the form submit', () => {
        spyOn(component, 'submitForm').and.callThrough();
        component.onCategoryUpdate(CATEGORY_DATA_WEB[0]);
        expect(component.category).toEqual(CATEGORY_DATA_WEB[0].categoryId);
        expect(component.submitForm).toHaveBeenCalled();
      });
    });

    describe('update search', () => {
      it('should update the category and keyword and call the form submit', () => {
        spyOn(component, 'submitForm').and.callThrough();
        component.onSearchUpdate(SUGGESTER_DATA_WEB[0]);
        expect(component.category).toEqual(SUGGESTER_DATA_WEB[0].category_id);
        expect(component.kws).toEqual(SUGGESTER_DATA_WEB[0].suggestion);
        expect(component.submitForm).toHaveBeenCalled();
      });
    });

    describe('search submit', () => {
      it('should update the keyword and call the form submit', () => {
        spyOn(component, 'submitForm').and.callThrough();
        component.onSearchSubmit(SUGGESTER_DATA_WEB[0].suggestion);
        expect(component.kws).toEqual(SUGGESTER_DATA_WEB[0].suggestion);
        expect(component.submitForm).toHaveBeenCalled();
      });
    });

    it('should redirect to the web when category is set', () => {
      component.category = CATEGORY_DATA_WEB[1].categoryId;
      component.submitForm();
      expect(windowRef.nativeWindow.location.href)
      .toEqual('https://www.wallapop.com/search?catIds=15245' + '&lat=42' + '&lng=2' + '&kws=' + '&verticalId=');
    });

    it('should redirect to the web when category is not set', () => {
      component.categoryEl = {
        nativeElement: {
          value: '15245'
        }
      };
      component.submitForm();
      expect(windowRef.nativeWindow.location.href)
      .toEqual('https://www.wallapop.com/search?catIds=15245' + '&lat=42' + '&lng=2' + '&kws=' + '&verticalId=');
    });

    it('should submit the search form for cars', () => {
      component.category = CATEGORY_DATA_WEB[0].categoryId;
      component.submitForm();
      expect(windowRef.nativeWindow.location.href)
      .toEqual('https://www.wallapop.com/search?catIds=100' + '&lat=42' + '&lng=2' + '&kws=' + '&verticalId=100');
    });
  });

  describe('upload', () => {
    it('should ', () => {
      spyOn(modalService, 'open');
      component.upload();
      expect(modalService.open).toHaveBeenCalledWith(UploadModalComponent, {windowClass: 'upload'});
    });
  });

});
