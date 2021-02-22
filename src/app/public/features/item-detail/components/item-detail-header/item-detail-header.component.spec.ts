import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsService } from '@core/errors/errors.service';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { ItemDetailService } from '../../core/services/item-detail.service';

import { ItemDetailHeaderComponent } from './item-detail-header.component';

describe('ItemDetailHeaderComponent', () => {
  let component: ItemDetailHeaderComponent;
  let fixture: ComponentFixture<ItemDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailHeaderComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        PublicUserApiService,
        ItemCardService,
        ItemApiService,
        RecommenderApiService,
        MapItemService,
        ToastService,
        {
          provide: PublicProfileService,
          useValue: {
            getStats() {
              return of();
            },
          },
        },
        {
          provide: CheckSessionService,
          useValue: {
            hasSession() {
              return true;
            },
            checkSessionAction() {},
          },
        },
        {
          provide: ItemDetailService,
          useValue: {
            reserveItem: () => {
              return of();
            },
            deleteItem: () => {
              return of();
            },
          },
        },
        {
          provide: ErrorsService,
          useValue: {
            i18nError() {},
            i18nSuccess() {},
          },
        },
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailHeaderComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when is our OWN item...', () => {
    describe('and the item is sold, onhold, expired or not available...', () => {
      it('only should show the trash button option', () => {});
    });

    describe('and the item is NOT sold, onhold, expired or not available...', () => {
      describe('and the item is featured...', () => {
        it('should show the countdown button', () => {});
      });

      describe('and the item NOT is featured...', () => {
        it('should show the feature button', () => {});
      });

      it('should show the reserve button option', () => {});

      it('should show the sold button option', () => {});

      it('should show the edit button option', () => {});

      it('should show the trash button option', () => {});
    });
  });

  describe('when is NOT our own item...', () => {
    describe('and the item is sold, onhold, expired or not available...', () => {
      it('should not show any button', () => {});
    });

    describe('and the item is NOT sold, onhold, expired or not available...', () => {
      it('should show the chat option button', () => {});

      it('should show the favourite option button', () => {});
    });
  });
});
