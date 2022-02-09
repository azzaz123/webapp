import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemSalePriceModalComponent } from './edit-item-sale-price-modal.component';

describe('EditItemSalePriceModalComponent', () => {
  let component: EditItemSalePriceModalComponent;
  let fixture: ComponentFixture<EditItemSalePriceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditItemSalePriceModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemSalePriceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
