import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsInboxComponent } from './notifications-inbox.component';

describe('NotificationsInboxComponent', () => {
  let component: NotificationsInboxComponent;
  let fixture: ComponentFixture<NotificationsInboxComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsInboxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
