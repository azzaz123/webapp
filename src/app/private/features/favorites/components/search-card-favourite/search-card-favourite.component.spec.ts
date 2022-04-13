import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FavouriteSearch } from '@api/core/model/favourites/search/favouriteSearch.interface';
import { SearchCardFavouriteComponent } from './search-card-favourite.component';

describe('ProfileCardFavoriteComponent', () => {
  let component: SearchCardFavouriteComponent;
  let fixture: ComponentFixture<SearchCardFavouriteComponent>;
  let element: HTMLElement;
  const mockFavouriteSearch: FavouriteSearch = {
    query: 'query',
    filters: 'some filters tatadta',
    isActive: true,
    gotNewResults: true,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [SearchCardFavouriteComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCardFavouriteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.favouriteSearch = mockFavouriteSearch;

    fixture.detectChanges();
  });

  describe('on rendering the component', () => {
    it('should not show the veil when the item favourite search is active', () => {
      const veil = fixture.debugElement.query(By.css('.FavouriteSearch__container-veil'));

      expect(veil).toBeNull();
    });

    it('should show the veil when the item favourite search is not active', () => {
      component.favouriteSearch.isActive = false;
      fixture.detectChanges();

      const veil = fixture.debugElement.query(By.css('.FavouriteSearch__container-veil'));

      expect(veil).toBeDefined();
    });

    it('should show the new badge when the favourite search has new items', () => {
      const badge = fixture.debugElement.query(By.css('.FavouriteSearch__badge .badge'));

      expect(badge).toBeDefined();
    });

    it('should show not show the new badge when the favourite search has no new items', () => {
      component.favouriteSearch.gotNewResults = false;

      fixture.detectChanges();
      const badge = fixture.debugElement.query(By.css('.FavouriteSearch__badge .badge'));

      expect(badge).toBeNull();
    });
  });

  describe('on clicking on remove favourite', () => {});

  describe('on clicking on reactivate favourite', () => {});

  describe('on clicking on favourite search', () => {});
});
