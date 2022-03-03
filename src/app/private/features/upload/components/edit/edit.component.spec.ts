import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ItemService } from '@core/item/item.service';
import { UserService } from '@core/user/user.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExitConfirmationModalComponent } from '@shared/exit-confirmation-modal/exit-confirmation-modal.component';
import { of } from 'rxjs';
import { EditTrackingEventService } from '../../core/services/edit-tracking-event/edit-tracking-event.service';
import { UPLOAD_PATHS } from '../../upload-routing-constants';
import { EditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let modalService: NgbModal;
  let router: Router;
  let analyticsService: AnalyticsService;
  let editTrackingEventService: EditTrackingEventService;
  const componentInstance: Partial<ExitConfirmationModalComponent> = {};

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                data: {
                  item: MOCK_ITEM,
                },
                params: {
                  id: 1,
                },
                parent: {
                  parent: {
                    parent: {
                      url: '',
                    },
                  },
                },
              },
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(true),
                  componentInstance: componentInstance,
                };
              },
            },
          },
          {
            provide: ItemService,
            useValue: {
              getUrgentProducts() {},
            },
          },
          {
            provide: Router,
            useClass: class MockRouter {
              get url() {
                return '';
              }
              navigate() {}
            },
          },
          {
            provide: UserService,
            useValue: {
              isProfessional() {
                return of(true);
              },
            },
          },
          EditTrackingEventService,
          { provide: AnalyticsService, useClass: MockAnalyticsService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);
    analyticsService = TestBed.inject(AnalyticsService);
    editTrackingEventService = TestBed.inject(EditTrackingEventService);
  });

  describe('ngOnInit', () => {
    it('should set item', () => {
      expect(component.item).toEqual(MOCK_ITEM);
    });
    it('should track view event when analytics service is ready', () => {
      spyOn(editTrackingEventService, 'trackViewEditItemEvent');

      component.ngOnInit();
      analyticsService.initializeAnalyticsWithGuestUser();

      expect(editTrackingEventService.trackViewEditItemEvent).toHaveBeenCalledWith(component.item.categoryId, component.isReactivation);
    });

    describe('when urls is set for activate shipping', () => {
      beforeEach(() => {
        jest.spyOn(router, 'url', 'get').mockReturnValue(UPLOAD_PATHS.ACTIVATE_SHIPPING);
        component.ngOnInit();
      });

      it('should notify to activate shipping to upload product', () => {
        expect(component.isActivateShipping).toEqual(true);
      });
    });
  });

  describe('validationError', () => {
    it('should set scrollTop to 0', () => {
      component.scrollPanel = {
        nativeElement: {},
      };

      component.validationError();

      expect(component.scrollPanel.nativeElement.scrollTop).toBe(0);
    });
  });

  describe('canExit', () => {
    it('should return true if there are no unsaved changes', () => {
      const result = component.canExit();

      expect(result).toBeTruthy();
    });

    it('should open modal if there are unsaved changes', fakeAsync(() => {
      let notSavedChanges: boolean;
      component['hasNotSavedChanges'] = true;
      spyOn(modalService, 'open').and.callThrough();

      (<Promise<boolean>>component.canExit()).then((value: boolean) => {
        notSavedChanges = value;
      });
      tick();

      expect(modalService.open).toHaveBeenCalledWith(ExitConfirmationModalComponent, {
        backdrop: 'static',
      });
      expect(componentInstance.item).toEqual(MOCK_ITEM);
      expect(notSavedChanges).toBeTruthy();
    }));
  });

  describe('formChanged', () => {
    it('should set hasNotSavedChanges', () => {
      component.formChanged(true);

      expect(component['hasNotSavedChanges']).toBeTruthy();
    });
  });
});
