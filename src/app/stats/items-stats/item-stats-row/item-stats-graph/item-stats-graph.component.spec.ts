import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStatsGraphComponent } from './item-stats-graph.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_ITEM_V3 } from '../../../../../tests/item.fixtures.spec';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { ITEM_STATISTIC_RESPONSE } from '../../../../../tests/statistics.fixtures.spec';

describe('ItemStatsGraphComponent', () => {
  let component: ItemStatsGraphComponent;
  let fixture: ComponentFixture<ItemStatsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemStatsGraphComponent ],
      providers: [
        I18nService
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

  describe('ngOnInit', () => {
    it('should call loadStats and push them to chartOptions', () => {
      component.statsData = ITEM_STATISTIC_RESPONSE;

      component.ngOnInit();

      expect(component.chartOption.series[1].data[0]).toBe(ITEM_STATISTIC_RESPONSE.entries[0].values.views);
    });
  });

});
