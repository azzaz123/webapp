import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '@core/item/item.service';
import { UserService } from '@core/user/user.service';
import {
  ITEM_ID,
  MOCK_ITEM,
  PRODUCT_RESPONSE,
} from '@fixtures/item.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitConfirmationModalComponent } from '@shared/exit-confirmation-modal/exit-confirmation-modal.component';
import { of } from 'rxjs';
import { EditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let modalService: NgbModal;
  let itemService: ItemService;
  const componentInstance: any = {};

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
            useValue: {
              navigate() {},
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
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    modalService = TestBed.inject(NgbModal);
    itemService = TestBed.inject(ItemService);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'getUrgentPrice');
    });
    it('should set item', () => {
      expect(component.item).toEqual(MOCK_ITEM);
    });
    it('should call getUrgentPrice', () => {
      component.ngOnInit();

      expect(component.getUrgentPrice).toHaveBeenCalled();
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

      expect(modalService.open).toHaveBeenCalledWith(
        ExitConfirmationModalComponent,
        {
          backdrop: 'static',
        }
      );
      expect(componentInstance.item).toEqual(MOCK_ITEM);
      expect(notSavedChanges).toBeTruthy();
    }));
  });

  describe('onFormChanged', () => {
    it('should set hasNotSavedChanges', () => {
      component.onFormChanged(true);

      expect(component['hasNotSavedChanges']).toBeTruthy();
    });
  });

  describe('get urgent price', () => {
    it('should set the urgent price', () => {
      spyOn(itemService, 'getUrgentProducts').and.returnValue(
        of(PRODUCT_RESPONSE)
      );

      component.getUrgentPrice();

      expect(itemService.getUrgentProducts).toHaveBeenCalledWith(ITEM_ID);
    });
  });
});
