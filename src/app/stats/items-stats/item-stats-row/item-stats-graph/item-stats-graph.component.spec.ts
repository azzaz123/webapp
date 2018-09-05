import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStatsGraphComponent } from './item-stats-graph.component';

describe('ItemStatsGraphComponent', () => {
  let component: ItemStatsGraphComponent;
  let fixture: ComponentFixture<ItemStatsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemStatsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStatsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
