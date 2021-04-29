import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardPlaceholderComponent } from './item-card-placeholder.component';

describe('ItemCardPlaceholderComponent', () => {
  let component: ItemCardPlaceholderComponent;
  let fixture: ComponentFixture<ItemCardPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardPlaceholderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
