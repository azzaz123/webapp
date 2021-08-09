import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CARS_CATEGORY } from '@core/item/item-categories';
import { MockTrustAndSafetyService } from '@core/trust-and-safety/trust-and-safety.fixtures.spec';
import { SessionProfileDataLocation } from '@core/trust-and-safety/trust-and-safety.interface';
import { TrustAndSafetyService } from '@core/trust-and-safety/trust-and-safety.service';
import { UserService } from '@core/user/user.service';
import { ITEM_DATA_V3, PRODUCT_RESPONSE } from '@fixtures/item.fixtures.spec';
import { NgxPermissionsModule } from 'ngx-permissions';
import { of } from 'rxjs';
import { UploadComponent } from './upload.component';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let userService: UserService;
  let trustAndSafetyService: TrustAndSafetyService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxPermissionsModule.forRoot()],
        declarations: [UploadComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: UserService,
            useValue: {
              isProfessional() {
                return of(false);
              },
            },
          },
          {
            provide: TrustAndSafetyService,
            useValue: MockTrustAndSafetyService,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    userService = TestBed.inject(UserService);
    trustAndSafetyService = TestBed.inject(TrustAndSafetyService);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'setCategory');
    });

    it('should set category cars if user is professional', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(true));

      component.ngOnInit();

      expect(component.setCategory).toHaveBeenCalledWith(CARS_CATEGORY);
    });

    it('should not set any category if user is not professional', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(false));

      component.ngOnInit();

      expect(component.setCategory).not.toHaveBeenCalled();
    });

    it('should delegate profiling to trust and safety team', () => {
      spyOn(trustAndSafetyService, 'submitProfile');

      component.ngOnInit();

      expect(trustAndSafetyService.submitProfile).toHaveBeenCalledTimes(1);
      expect(trustAndSafetyService.submitProfile).toHaveBeenCalledWith(SessionProfileDataLocation.OPEN_CREATE_LISTING);
    });
  });

  describe('setCategory', () => {
    it('should set categoryId', () => {
      const CATEGORY_ID = 123;

      component.setCategory(CATEGORY_ID.toString());

      expect(component.categoryId).toBe(CATEGORY_ID.toString());
    });
  });

  describe('onValidationError', () => {
    it('should set scrollTop to 0', () => {
      component.scrollPanel = {
        nativeElement: {},
      };

      component.onValidationError();

      expect(component.scrollPanel.nativeElement.scrollTop).toBe(0);
    });
  });
});
