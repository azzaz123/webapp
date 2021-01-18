import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFlagComponent } from './item-flag.component';

describe('ItemFlagComponent', () => {
  let component: ItemFlagComponent;
  let fixture: ComponentFixture<ItemFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemFlagComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
