import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NOTIFICATION_PRODUCT_STATUS } from '@private/features/inbox/core/enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '@private/features/inbox/core/enums/notification-variant.enum';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NotificationImageComponent } from './notification-image.component';

describe('NotificationImageComponent', () => {
  let component: NotificationImageComponent;
  let fixture: ComponentFixture<NotificationImageComponent>;
  let element: HTMLElement;

  const image: string = 'https://picsum.photos/200/300';
  const productStatusReserved: NOTIFICATION_PRODUCT_STATUS = NOTIFICATION_PRODUCT_STATUS.RESERVED;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NgxPermissionsModule.forRoot()],
        declarations: [NotificationImageComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationImageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe(`If receive a empty product status`, () => {
    beforeEach(() => {
      component.image = image;
      component.productStatus = undefined;
      fixture.detectChanges();
    });
    it('should render a circle image', () => {
      const highlightedNotification: DebugElement = fixture.debugElement.query(By.css('.NotificationImage--circle'));
      expect(highlightedNotification).toBeTruthy();
    });
  });

  describe(`If receive a reserved product status`, () => {
    beforeEach(() => {
      component.image = image;
      component.productStatus = productStatusReserved;
      fixture.detectChanges();
    });
    it('should render a rounded image', () => {
      const highlightedNotification: DebugElement = fixture.debugElement.query(By.css('.NotificationImage--rounded'));
      expect(highlightedNotification).toBeTruthy();
    });
    it('should render a reserved badge with icon', () => {
      const highlightedNotification: DebugElement = fixture.debugElement.query(By.css('tsl-svg-icon'));
      expect(highlightedNotification).toBeTruthy();
    });
  });
});
