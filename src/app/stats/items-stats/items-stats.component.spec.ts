import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsStatsComponent } from './items-stats.component';

describe('ItemsStatsComponent', () => {
  let component: ItemsStatsComponent;
  let fixture: ComponentFixture<ItemsStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
