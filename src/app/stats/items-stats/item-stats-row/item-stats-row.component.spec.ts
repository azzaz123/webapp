import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStatsRowComponent } from './item-stats-row.component';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ItemStatsService } from './item-stats-graph/item-stats.service';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { MOCK_ITEM_V3 } from '../../../../tests/item.fixtures.spec';

describe('ItemStatsRowComponent', () => {
  let component: ItemStatsRowComponent;
  let fixture: ComponentFixture<ItemStatsRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentModule],
      declarations: [ ItemStatsRowComponent, CustomCurrencyPipe ],
      providers: [
        I18nService,
        DecimalPipe,
        {
          provide: 'SUBDOMAIN', useValue: 'wallapop.com'
        },
        {
          provide: ItemStatsService, useValue: {
          getStatistics() {
            return Observable.of({});
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStatsRowComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM_V3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
