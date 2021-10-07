import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { ErrorBoxModule } from '@shared/error-box/error-box.module';

import { SearchErrorLayoutComponent } from './search-error-layout.component';

describe('SearchErrorLayoutComponent', () => {
  let component: SearchErrorLayoutComponent;
  let fixture: ComponentFixture<SearchErrorLayoutComponent>;
  let searchNavigatorService: SearchNavigatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ErrorBoxModule],
      declarations: [SearchErrorLayoutComponent],
      providers: [
        {
          provide: SearchNavigatorService,
          useValue: {
            navigateWithLocationParams: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchErrorLayoutComponent);
    searchNavigatorService = TestBed.inject(SearchNavigatorService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when clicking the exit button', () => {
    it('should redirect to the search page without search parameters', () => {
      const exitButton = fixture.debugElement.query(By.css('button')).nativeNode;
      spyOn(searchNavigatorService, 'navigateWithLocationParams');

      exitButton.click();

      expect(searchNavigatorService.navigateWithLocationParams).toHaveBeenCalledWith({});
    });
  });
});
