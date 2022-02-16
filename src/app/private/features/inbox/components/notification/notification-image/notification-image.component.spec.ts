import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationImageComponent } from './notification-image.component';

describe('NotificationImageComponent', () => {
  let component: NotificationImageComponent;
  let fixture: ComponentFixture<NotificationImageComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationImageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
