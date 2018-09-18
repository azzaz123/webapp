import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsStatsComponent } from './items-stats.component';
import { ItemService } from '../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { MomentModule } from 'angular2-moment';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ItemsStatsComponent', () => {
  let component: ItemsStatsComponent;
  let fixture: ComponentFixture<ItemsStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentModule],
      declarations: [ ItemsStatsComponent ],
      providers: [
        {
          provide: ItemService, useValue: {
          mine() {
            return Observable.of({data: []});
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
