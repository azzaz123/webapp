import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayviewPromotionEditorComponent } from './payview-promotion-editor.component';

describe('PayviewPromotionEditorComponent', () => {
  let component: PayviewPromotionEditorComponent;
  let fixture: ComponentFixture<PayviewPromotionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewPromotionEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayviewPromotionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
