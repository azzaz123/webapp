import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemAvatarComponent } from './item-avatar.component';
import { SanitizedBackgroundDirective } from '../sanitized-background/sanitized-background.directive';
import { FAKE_ITEM_IMAGE_SMALL_BASE_PATH, FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH, Item } from '@core/item/item';
import { MOCK_ITEM, MOCK_ITEM_FEATURED } from '@fixtures/item.fixtures.spec';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';
import { By } from '@angular/platform-browser';
import { cloneDeep } from 'lodash-es';
import { CREATE_MOCK_INBOX_CONVERSATION } from '@fixtures/chat';
import { InboxItem } from '@private/features/chat/core/model';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
class MockSvgIconComponent {
  @Input() src: string;
}

describe('ItemAvatarComponent', () => {
  let component: ItemAvatarComponent;
  let fixture: ComponentFixture<ItemAvatarComponent>;
  let permissionService: NgxPermissionsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxPermissionsModule.forRoot()],
        declarations: [ItemAvatarComponent, SanitizedBackgroundDirective, MockSvgIconComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAvatarComponent);
    permissionService = TestBed.inject(NgxPermissionsService);
    component = fixture.componentInstance;
  });

  it('should set the avatar and the fallback', () => {
    component.item = MOCK_ITEM;
    component.ngOnChanges();
    expect(component.fallback).toBe(FAKE_ITEM_IMAGE_SMALL_BASE_PATH);
  });

  it('should set the light fallback', () => {
    component.item = MOCK_ITEM;
    component.fallbackLight = true;
    component.ngOnChanges();
    expect(component.fallback).toBe(FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH);
  });

  it('should set the avatar with empty string', () => {
    component.item = new Item('1', 1, USER_ID);
    component.ngOnChanges();
    expect(component.avatar).toBe('');
  });

  describe('Feature section', () => {
    describe('Item is featured...', () => {
      beforeEach(() => {
        component.item = MOCK_ITEM_FEATURED;
        fixture.detectChanges();
      });
      describe('and has visibility permissions', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.bumps);
        });
        it('should show feature section', () => {
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.css('.featured'))).toBeTruthy();
        });
      });
      describe('and has not visibility permissions', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.bumps);
        });
        it('should not show feature section', () => {
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.css('.featured'))).toBeFalsy();
        });
      });
    });
  });

  describe('Overlay', () => {
    describe('and is featured item', () => {
      beforeEach(() => {
        component.item = MOCK_ITEM_FEATURED;
        fixture.detectChanges();
      });
      it('should show overlay', () => {
        expect(fixture.debugElement.query(By.css('.overlay'))).toBeTruthy();
      });
    });
    describe('and is sold item', () => {
      beforeEach(() => {
        component.item = cloneDeep(MOCK_ITEM);
        component.item.sold = true;
        component.item.reserved = false;
        component.item.notAvailable = false;
        fixture.detectChanges();
      });
      it('should show overlay', () => {
        expect(fixture.debugElement.query(By.css('.overlay'))).toBeTruthy();
      });
    });
    describe('and is reserved item', () => {
      beforeEach(() => {
        component.item = cloneDeep(MOCK_ITEM);
        component.item.sold = false;
        component.item.reserved = true;
        component.item.notAvailable = false;
        fixture.detectChanges();
      });
      it('should show overlay', () => {
        expect(fixture.debugElement.query(By.css('.overlay'))).toBeTruthy();
      });
    });
    describe('and is notAvailable item', () => {
      beforeEach(() => {
        component.item = cloneDeep(MOCK_ITEM);
        component.item.sold = false;
        component.item.reserved = false;
        component.item.notAvailable = true;
        fixture.detectChanges();
      });
      it('should show overlay', () => {
        expect(fixture.debugElement.query(By.css('.overlay'))).toBeTruthy();
      });
    });
    describe('and is a normal item', () => {
      beforeEach(() => {
        component.item = cloneDeep(MOCK_ITEM);
        component.item.sold = false;
        component.item.reserved = false;
        component.item.notAvailable = false;
        fixture.detectChanges();
      });
      it('should show overlay', () => {
        expect(fixture.debugElement.query(By.css('.overlay'))).toBeFalsy();
      });
    });
  });

  describe('Not available', () => {
    describe('and has to show status', () => {
      beforeEach(() => {
        component.showAvailableStatus = true;
      });
      describe('and is unpublished item', () => {
        beforeEach(() => {
          component.item = cloneDeep(CREATE_MOCK_INBOX_CONVERSATION().item) as InboxItem;
          component.item.sold = false;
          component.item.reserved = false;
          component.item.notAvailable = false;
          component.item.unpublished = true;
          fixture.detectChanges();
        });
        it('should show not available icon', () => {
          const element = fixture.debugElement.query(By.css('.not-available')).query(By.directive(MockSvgIconComponent));
          expect(element).toBeTruthy();

          const icon: MockSvgIconComponent = element.componentInstance;
          expect(icon.src).toBe('/assets/icons/warning.svg');
        });
      });
      describe('and is not available item', () => {
        beforeEach(() => {
          component.item = cloneDeep(MOCK_ITEM);
          component.item.sold = false;
          component.item.reserved = false;
          component.item.notAvailable = true;
          fixture.detectChanges();
        });
        it('should show not available icon', () => {
          const element = fixture.debugElement.query(By.css('.not-available')).query(By.directive(MockSvgIconComponent));
          expect(element).toBeTruthy();

          const icon: MockSvgIconComponent = element.componentInstance;
          expect(icon.src).toBe('/assets/icons/warning.svg');
        });
      });
      describe('and is available item', () => {
        beforeEach(() => {
          component.item = cloneDeep(MOCK_ITEM);
          component.item.sold = false;
          component.item.reserved = false;
          component.item.notAvailable = false;
          component.showAvailableStatus = true;
          fixture.detectChanges();
        });
        it('should not show not available icon', () => {
          const element = fixture.debugElement.query(By.css('.not-available'));
          expect(element).toBeFalsy();
        });
      });
    });
    describe('and has not to show status', () => {
      beforeEach(() => {
        component.showAvailableStatus = false;
        component.item = cloneDeep(MOCK_ITEM);
        component.item.sold = false;
        component.item.reserved = false;
        component.item.notAvailable = true;
        fixture.detectChanges();
      });
      it('should not show not available icon', () => {
        const element = fixture.debugElement.query(By.css('.not-available'));
        expect(element).toBeFalsy();
      });
    });
  });

  describe('Is sold', () => {
    describe('and is sold item', () => {
      beforeEach(() => {
        component.item = cloneDeep(MOCK_ITEM);
        component.item.sold = true;
        component.item.reserved = false;
      });
      describe('and is available', () => {
        beforeEach(() => {
          component.item.notAvailable = false;
          fixture.detectChanges();
        });
        it('should show sold icon', () => {
          const element = fixture.debugElement.query(By.css('.sold')).query(By.directive(MockSvgIconComponent));
          expect(element).toBeTruthy();

          const icon: MockSvgIconComponent = element.componentInstance;
          expect(icon.src).toBe('/assets/icons/sold.svg');
        });
      });
      describe('and is not available', () => {
        beforeEach(() => {
          component.item.notAvailable = true;
          fixture.detectChanges();
        });
        it('should not show not available icon', () => {
          const element = fixture.debugElement.query(By.css('.sold'));
          expect(element).toBeFalsy();
        });
      });
    });
    describe('and is not sold item', () => {
      beforeEach(() => {
        component.item = cloneDeep(MOCK_ITEM);
        component.item.sold = false;
        component.item.reserved = false;
        component.item.notAvailable = false;
        fixture.detectChanges();
      });
      it('should show not available icon', () => {
        const element = fixture.debugElement.query(By.css('.sold'));
        expect(element).toBeFalsy();
      });
    });
  });

  describe('Is reserved', () => {
    describe('and is reserved item', () => {
      beforeEach(() => {
        component.item = cloneDeep(MOCK_ITEM);
        component.item.reserved = true;
      });
      describe('and is not featured, sold or not available', () => {
        beforeEach(() => {
          component.item.sold = false;
          component.item.notAvailable = false;
          fixture.detectChanges();
        });
        it('should show reserved icon', () => {
          const element = fixture.debugElement.query(By.css('.reserved')).query(By.directive(MockSvgIconComponent));
          expect(element).toBeTruthy();

          const icon: MockSvgIconComponent = element.componentInstance;
          expect(icon.src).toBe('/assets/icons/reserved.svg');
        });
      });
      describe('and is featured item', () => {
        beforeEach(() => {
          component.item = cloneDeep(MOCK_ITEM_FEATURED);
          component.item.sold = false;
          component.item.reserved = true;
          component.item.notAvailable = false;
          fixture.detectChanges();
        });
        it('should not show reserved icon', () => {
          const element = fixture.debugElement.query(By.css('.reserved'));
          expect(element).toBeFalsy();
        });
      });
      describe('and is sold item', () => {
        beforeEach(() => {
          component.item.sold = true;
          component.item.notAvailable = false;
          fixture.detectChanges();
        });
        it('should not show reserved icon', () => {
          const element = fixture.debugElement.query(By.css('.reserved'));
          expect(element).toBeFalsy();
        });
      });
      describe('and is not available item', () => {
        beforeEach(() => {
          component.item.sold = false;
          component.item.notAvailable = true;
          fixture.detectChanges();
        });
        it('should not show reserved icon', () => {
          const element = fixture.debugElement.query(By.css('.reserved'));
          expect(element).toBeFalsy();
        });
      });
    });
  });
});
