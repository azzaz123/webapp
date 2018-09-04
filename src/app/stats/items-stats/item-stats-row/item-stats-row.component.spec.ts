import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStatsRowComponent } from './item-stats-row.component';

describe('ItemStatsRowComponent', () => {
  let component: ItemStatsRowComponent;
  let fixture: ComponentFixture<ItemStatsRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemStatsRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStatsRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
