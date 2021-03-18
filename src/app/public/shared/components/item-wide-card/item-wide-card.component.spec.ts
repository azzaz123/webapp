import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWideCardComponent } from './item-wide-card.component';

describe('ItemWideCardComponent', () => {
  let component: ItemWideCardComponent;
  let fixture: ComponentFixture<ItemWideCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemWideCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemWideCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
