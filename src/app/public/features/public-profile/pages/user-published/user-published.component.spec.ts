import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemCardListModule } from '@public/core/components/item-card-list/item-card-list.module';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { MapItemService } from './services/map-item/map-item.service';

import { UserPublishedComponent } from './user-published.component';

describe('UserPublishedComponent', () => {
  let component: UserPublishedComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<UserPublishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ItemCardListModule],
      declarations: [UserPublishedComponent],
      providers: [PublicProfileService, MapItemService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPublishedComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when component inits', () => {
    const itemCardSelector = 'tsl-public-item-card';

    it('should print same amount of items recieved', () => {
      const componentItemsLength = component.items.length;
      const domItemsLength = el.querySelectorAll(itemCardSelector).length;

      expect(componentItemsLength).toEqual(domItemsLength);
    });
  });
});
