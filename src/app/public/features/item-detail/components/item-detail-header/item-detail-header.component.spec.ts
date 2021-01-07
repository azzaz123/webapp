import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailHeaderComponent } from './item-detail-header.component';

describe('ItemDetailHeaderComponent', () => {
  let component: ItemDetailHeaderComponent;
  let fixture: ComponentFixture<ItemDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
