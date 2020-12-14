import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SendVerifyEmailComponent } from './send-verify-email.component';

describe('SendVerifyEmailComponent', () => {
  let component: SendVerifyEmailComponent;
  let fixture: ComponentFixture<SendVerifyEmailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SendVerifyEmailComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SendVerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
