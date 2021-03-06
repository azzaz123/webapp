import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SelectedItemsComponent } from './selected-items.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemService } from '@core/item/item.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReplaySubject } from 'rxjs';
import { createItemsArray } from '@fixtures/item.fixtures.spec';
import { CatalogItemTrackingEventService } from '@private/features/catalog/core/services/catalog-item-tracking-event.service';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';
import { By } from '@angular/platform-browser';
import { ButtonModule } from '@shared/button/button.module';
import { ButtonComponent } from '@shared/button/button.component';

describe('SelectedItemsComponent', () => {
  let component: SelectedItemsComponent;
  let fixture: ComponentFixture<SelectedItemsComponent>;
  let itemService: ItemService;
  let catalogItemTrackingEventService: CatalogItemTrackingEventService;
  let permissionService: NgxPermissionsService;
  const anId = '1';
  const anotherId = '2';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectedItemsComponent],
        imports: [NoopAnimationsModule, NgxPermissionsModule.forRoot(), ButtonModule],
        providers: [
          { provide: CatalogItemTrackingEventService, useValue: { trackClickBumpItems: () => {} } },
          {
            provide: ItemService,
            useValue: {
              selectedItems$: new ReplaySubject(),
              selectedItems: [],
              selectedAction: null,
              deselectItems: () => {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedItemsComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    catalogItemTrackingEventService = TestBed.inject(CatalogItemTrackingEventService);
    permissionService = TestBed.inject(NgxPermissionsService);
  });

  describe('ngOnInit', () => {
    it('should set selectedItems with items', () => {
      itemService.selectedAction = 'feature';
      const ITEMS = createItemsArray(5);
      component.items = ITEMS;
      itemService.selectedItems = [anId, anotherId];
      fixture.detectChanges();

      itemService.selectedItems$.next({
        id: anId,
        action: 'selected',
      });

      expect(component.selectedItems).toEqual([ITEMS[0], ITEMS[1]]);
    });

    it('should set disableFeatureOption if a selected item is inactive or expired', () => {
      itemService.selectedAction = 'feature';
      const ITEMS = createItemsArray(5);
      ITEMS[0].flags.expired = true;
      component.items = ITEMS;
      itemService.selectedItems = [anId, anotherId];
      fixture.detectChanges();

      itemService.selectedItems$.next({
        id: anId,
        action: 'selected',
      });

      expect(component.disableFeatureOption).toBe(true);
    });
  });

  describe('deselect', () => {
    it('should call deselect method from itemService', () => {
      spyOn(itemService, 'deselectItems');

      component.deselect();

      expect(itemService.deselectItems).toHaveBeenCalledTimes(1);
    });

    it('should set as not selected all items', () => {
      const mockItems = createItemsArray(5);
      mockItems.forEach((i) => (i.selected = true));
      component.items = mockItems;

      component.deselect();

      mockItems.forEach((i) => {
        expect(i.selected).toBeFalsy();
      });
    });

    it('should set selectedAction as none', () => {
      component.deselect();

      expect(itemService.selectedAction).toBeFalsy();
    });

    it('should clear selected items from component', () => {
      const mockItems = createItemsArray(5);
      component.selectedItems = mockItems;

      component.deselect();

      expect(component.selectedItems.length).toBe(0);
    });
  });

  describe('onClickAction', () => {
    it('should call emit value when clicked', () => {
      const action = 'supnibba';
      spyOn(component.selectedAction, 'emit');

      component.onClickAction(action);

      expect(component.selectedAction.emit).toHaveBeenCalledTimes(1);
      expect(component.selectedAction.emit).toHaveBeenCalledWith(action);
    });
  });

  describe('feature items', () => {
    describe('and has visibility permissions', () => {
      beforeEach(() => {
        component.ngOnInit();
        permissionService.addPermission(PERMISSIONS.bumps);
        fixture.detectChanges();
      });
      describe('and button is enabled', () => {
        describe('and click button', () => {
          it('should track event', () => {
            spyOn(catalogItemTrackingEventService, 'trackClickBumpItems').and.callThrough();
            itemService.selectedAction = 'feature';
            const ITEMS = createItemsArray(5);
            component.items = ITEMS;
            itemService.selectedItems$.next({
              id: anId,
              action: 'selected',
            });
            fixture.detectChanges();

            const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
            button.click();

            expect(catalogItemTrackingEventService.trackClickBumpItems).toBeCalledTimes(1);
            expect(catalogItemTrackingEventService.trackClickBumpItems).toBeCalledWith(component.selectedItems.length);
          });
        });
        describe('and button is disabled', () => {
          it('should not track event', () => {
            spyOn(catalogItemTrackingEventService, 'trackClickBumpItems').and.callThrough();
            itemService.selectedAction = 'feature';
            const ITEMS = createItemsArray(5);
            component.items = ITEMS;
            itemService.selectedItems = [];

            fixture.detectChanges();
            const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
            button.click();

            expect(catalogItemTrackingEventService.trackClickBumpItems).not.toHaveBeenCalled();
          });
        });
      });
    });
    describe('and has not visibility permissions', () => {
      it('should now show button', () => {
        spyOn(catalogItemTrackingEventService, 'trackClickBumpItems').and.callThrough();
        itemService.selectedAction = 'feature';
        const ITEMS = createItemsArray(5);
        component.items = ITEMS;
        itemService.selectedItems = [anId, anotherId];
        fixture.detectChanges();
        itemService.selectedItems$.next({
          id: anId,
          action: 'selected',
        });

        const button = fixture.debugElement.query(By.directive(ButtonComponent));

        expect(button).toBeFalsy();
      });
    });
  });
});
