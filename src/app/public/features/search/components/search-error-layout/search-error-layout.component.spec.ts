import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { ErrorBoxModule } from '@shared/error-box/error-box.module';
import { APP_PATHS } from 'app/app-routing-constants';

import { SearchErrorLayoutComponent } from './search-error-layout.component';

describe('SearchErrorLayoutComponent', () => {
  let component: SearchErrorLayoutComponent;
  let fixture: ComponentFixture<SearchErrorLayoutComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ErrorBoxModule],
      declarations: [SearchErrorLayoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchErrorLayoutComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when clicking the exit button', () => {
    it('should redirect to the search page without search parameters', () => {
      const exitButton = fixture.debugElement.query(By.css('button')).nativeNode;
      spyOn(router, 'navigate');

      exitButton.click();

      expect(router.navigate).toHaveBeenCalledWith([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.SEARCH}`]);
    });
  });
});
