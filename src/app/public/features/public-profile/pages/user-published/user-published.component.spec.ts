import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { DeviceDetectorModule, DeviceDetectorService } from 'ngx-device-detector';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { ItemCardListModule } from '@public/shared/components/item-card-list/item-card-list.module';

import { UserPublishedComponent } from './user-published.component';
import { MapPublishedItemCardService } from '../../core/services/map-published-item-card/map-published-item-card.service';

describe('UserPublishedComponent', () => {
  let component: UserPublishedComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<UserPublishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ItemCardListModule, DeviceDetectorModule, RouterTestingModule],
      declarations: [UserPublishedComponent],
      providers: [
        PublicProfileService,
        MapPublishedItemCardService,
        CheckSessionService,
        PublicUserApiService,
        DeviceDetectorService,
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: 'ACCESS_TOKEN',
          },
        },
      ],
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

    it('should print same amount of items received', () => {
      const componentItemsLength = component.items.length;
      const domItemsLength = el.querySelectorAll(itemCardSelector).length;

      expect(componentItemsLength).toEqual(domItemsLength);
    });
  });
});
