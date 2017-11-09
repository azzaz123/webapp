import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { ItemCartFavoriteComponent } from './item-cart-favorite.component';
import { MdIconModule } from '@angular/material';
import { ItemService } from '../item.service';
import { WindowRef } from 'shield';

import {
  MOCK_ITEM
} from 'shield';

describe('ItemCartFavoriteComponent', () => {
  let component: ItemCartFavoriteComponent;
  let fixture: ComponentFixture<ItemCartFavoriteComponent>;
  let element: HTMLElement;

  let itemService: ItemService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, MdIconModule],
      declarations: [ ItemCartFavoriteComponent ],
      providers: [
        WindowRef,
        { provide: ItemService, user: {}},
        { provide: 'SUBDOMAIN', useValue: 'www'}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCartFavoriteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.item = MOCK_ITEM;
    itemService = TestBed.get(ItemService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
