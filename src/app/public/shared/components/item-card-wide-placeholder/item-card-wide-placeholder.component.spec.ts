import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardWidePlaceholderComponent } from './item-card-wide-placeholder.component';

describe('ItemCardWidePlaceholderComponent', () => {
  let component: ItemCardWidePlaceholderComponent;
  let fixture: ComponentFixture<ItemCardWidePlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardWidePlaceholderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardWidePlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
