import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSpecificationsComponent } from './item-specifications.component';

describe('ItemSpecificationsComponent', () => {
  let component: ItemSpecificationsComponent;
  let fixture: ComponentFixture<ItemSpecificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemSpecificationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
