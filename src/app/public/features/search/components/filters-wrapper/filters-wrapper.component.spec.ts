import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersWrapperComponent } from './filters-wrapper.component';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { DrawerModule } from '@public/shared/components/drawer/drawer.module';
import { FilterGroupComponentStub } from '@public/shared/components/filters/components/filter-group/services/filter-group.component.stub';
import { FilterParameterDraftService } from '@public/shared/services/filter-parameter-draft/filter-parameter-draft.service';
import { FilterParameterStoreService } from '../../core/services/filter-parameter-store.service';

describe('FiltersWrapperComponent', () => {
  let component: FiltersWrapperComponent;
  let fixture: ComponentFixture<FiltersWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersWrapperComponent, FilterGroupComponentStub],
      imports: [BubbleModule, DrawerModule],
      providers: [FilterParameterStoreService, FilterParameterDraftService],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when closing the drawer', () => {
    beforeEach(() => {
      component.closeDrawer();
    });

    it('should close the drawer', () => {
      expect(component.drawerConfig.isOpen).toBeFalsy();
    });
  });

  describe('when toggling the drawer', () => {
    describe('if was previously opened', () => {
      beforeEach(() => {
        component.drawerConfig.isOpen = true;
        component.toggleDrawer();
      });

      it('should close the drawer', () => {
        expect(component.drawerConfig.isOpen).toBeFalsy();
      });
    });

    describe('if was previously closed', () => {
      beforeEach(() => {
        component.drawerConfig.isOpen = false;
        component.toggleDrawer();
      });

      it('should open the drawer', () => {
        expect(component.drawerConfig.isOpen).toBeTruthy();
      });
    });
  });

  describe('when filters button is clicked', () => {
    let initialState: boolean;
    const filtersButtonSelector = 'tsl-bubble';

    beforeEach(() => {
      initialState = component.drawerConfig.isOpen;
      fixture.nativeElement.querySelector(filtersButtonSelector).click();
    });

    it('should toggle the drawer', () => {
      expect(!initialState).toEqual(component.drawerConfig.isOpen);
    });
  });

  describe('when filter bubble open state changes', () => {
    it('should emit open state change event with the same value', () => {
      const value = true;
      spyOn(component.bubbleFilterOpenStateChange, 'emit');

      component.bubbleOpenStateChange(value);

      expect(component.bubbleFilterOpenStateChange.emit).toBeCalledWith(value);
    });
  });
});