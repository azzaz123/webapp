import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHeaderDropdownComponent } from './item-header-dropdown.component';

describe('ItemHeaderDropdownComponent', () => {
  let component: ItemHeaderDropdownComponent;
  let fixture: ComponentFixture<ItemHeaderDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemHeaderDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemHeaderDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
