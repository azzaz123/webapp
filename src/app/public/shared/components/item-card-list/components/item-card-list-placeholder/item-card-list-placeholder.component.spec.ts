import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardListPlaceholderComponent } from './item-card-list-placeholder.component';

describe('ItemCardListPlaceholderComponent', () => {
  let component: ItemCardListPlaceholderComponent;
  let fixture: ComponentFixture<ItemCardListPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardListPlaceholderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardListPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
