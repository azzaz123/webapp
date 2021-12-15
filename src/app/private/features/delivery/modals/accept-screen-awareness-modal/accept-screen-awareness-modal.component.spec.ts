import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptScreenAwarenessModalComponent } from './accept-screen-awareness-modal.component';

describe('AcceptScreenAwarenessModalComponent', () => {
  let component: AcceptScreenAwarenessModalComponent;
  let fixture: ComponentFixture<AcceptScreenAwarenessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptScreenAwarenessModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptScreenAwarenessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
