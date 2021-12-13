import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TRXAwarenessModalComponent } from './trx-awareness-modal.component';

describe('TRXAwarenessModalComponent', () => {
  let component: TRXAwarenessModalComponent;
  let fixture: ComponentFixture<TRXAwarenessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TRXAwarenessModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TRXAwarenessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
