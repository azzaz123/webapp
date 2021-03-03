import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemExtraInfoComponent } from './item-extra-info.component';

describe('ItemExtraInfoComponent', () => {
  let component: ItemExtraInfoComponent;
  let fixture: ComponentFixture<ItemExtraInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemExtraInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExtraInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
