import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStatsGraphComponent } from './item-stats-graph.component';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_ITEM_V3 } from '../../../../../tests/item.fixtures.spec';
import { I18nService } from '../../../../core/i18n/i18n.service';

describe('ItemStatsGraphComponent', () => {
  let component: ItemStatsGraphComponent;
  let fixture: ComponentFixture<ItemStatsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemStatsGraphComponent ],
      providers: [
        I18nService,
        {
          provide: AmChartsService, useValue: {
          makeChart() {
          },
          destroyChart() {
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStatsGraphComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM_V3;
    component.statsData = {
      entries: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
