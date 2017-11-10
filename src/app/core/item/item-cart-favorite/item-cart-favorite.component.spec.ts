import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { Observable } from 'rxjs/Observable';
import { ItemCartFavoriteComponent } from './item-cart-favorite.component';
import { MdIconModule } from '@angular/material';
import { ItemService } from '../item.service';
import { WindowRef } from 'shield';
import { environment } from '../../../../environments/environment';

import {
  MOCK_ITEM
} from 'shield';

describe('ItemCartFavoriteComponent', () => {
  let component: ItemCartFavoriteComponent;
  let fixture: ComponentFixture<ItemCartFavoriteComponent>;
  let element: HTMLElement;

  let itemService: ItemService;
  let windowRef: WindowRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, MdIconModule],
      declarations: [ ItemCartFavoriteComponent ],
      providers: [
        {provide: WindowRef, useValue: {
            nativeWindow: {
              location: {
                href: environment.siteUrl
              }
            }
          }
        },
        { provide: ItemService, user: {
          favoriteItem () {
            return Observable.of({});
          }
        }},
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
    windowRef = TestBed.get(WindowRef);
    fixture.detectChanges();
  });

  describe('when coponent is created', () => {
    it('should define homeUrl', () => {
      // console.log(component.homeUrl)
    })
  });

  describe('goToItemDetail', () => {
    it('should change window url', () => {
      component.goToItemDetail();
      console.log(windowRef.nativeWindow.location.href);
    })
  });

  describe('removeFavorite', ()=>{
    it('should set favorited property to false', () => {
      component.removeFavorite();
      expect(component.item.favorited).toBeFalsy();
    });
    it('should set favorited property to false', () => {
      component.removeFavorite();
      expect(component.item.favorited).toBeFalsy();
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
