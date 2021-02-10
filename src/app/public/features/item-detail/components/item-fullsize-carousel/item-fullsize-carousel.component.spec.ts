import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { CookieService } from 'ngx-cookie';
import { ItemFullSizeCarouselComponent } from './item-fullsize-carousel.component';

describe('ItemFullSizeCarouselComponent', () => {
  const itemBackButtonClass = '.ItemHeader__backButton';
  const itemInfoClass = '.ItemInfo';

  let component: ItemFullSizeCarouselComponent;
  let fixture: ComponentFixture<ItemFullSizeCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemFullSizeCarouselComponent],
      imports: [HttpClientModule],
      providers: [
        CheckSessionService,
        ItemCardService,
        ItemApiService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFullSizeCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we click on the back button...', () => {
    it('should hidde the component', () => {});
  });

  describe('when we have an item...', () => {
    it('should show the item title', () => {});

    it('should show the item price with their currency', () => {});
  });

  describe('when we click on th favourite button...', () => {
    describe('and we have a current session...', () => {
      it('should toggle the favourite button', () => {});
    });
    describe('and we NOT have a current session...', () => {
      it('should check the session action', () => {});
    });
  });

  describe('when we clic on the chat button...', () => {
    it('should redirect to the item chat page', () => {});
  });
});
