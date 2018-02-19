import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutComponent } from './checkout.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { ITEMS_WITH_PRODUCTS } from '../../../tests/item.fixtures';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutComponent ],
      providers: [
        {
          provide: ItemService, useValue: {
          selectedItems: ['id'],
          getItemsWithAvailableProducts() {
            return Observable.of(ITEMS_WITH_PRODUCTS);
          }
        }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
