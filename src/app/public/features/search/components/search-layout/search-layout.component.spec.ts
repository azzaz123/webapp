import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLayoutComponent } from './search-layout.component';
import { ViewportService } from '@core/viewport/viewport.service';
import { DebugElement, Predicate } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ViewportType } from '@core/viewport/viewport.enum';
import { By } from '@angular/platform-browser';

describe('SearchLayoutComponent', () => {
  let component: SearchLayoutComponent;
  let fixture: ComponentFixture<SearchLayoutComponent>;
  let viewportSubject: ReplaySubject<ViewportType>;

  beforeEach(async () => {
    viewportSubject = new ReplaySubject(1);

    await TestBed.configureTestingModule({
      declarations: [SearchLayoutComponent],
      providers: [
        {
          provide: ViewportService,
          useValue: {
            onViewportChange: viewportSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When viewport is...', () => {
    const rightColSelector = By.css('.col.d-none.d-xl-flex');
    const bottomRowSelector = By.css('.row.d-md-none');
    describe('XS', () => {
      beforeEach(() => {
        viewportSubject.next(ViewportType.XS);
        fixture.detectChanges();
      });
      it('should NOT show right column', () => {
        expectBlockToRender(rightColSelector, false);
      });
      it('should show bottom row', () => {
        expectBlockToRender(bottomRowSelector, true);
      });
    });
    describe('SM', () => {
      beforeEach(() => {
        viewportSubject.next(ViewportType.SM);
        fixture.detectChanges();
      });
      it('should NOT show right column', () => {
        expectBlockToRender(rightColSelector, false);
      });
      it('should show bottom row', () => {
        expectBlockToRender(bottomRowSelector, true);
      });
    });
    describe('MD', () => {
      beforeEach(() => {
        viewportSubject.next(ViewportType.MD);
        fixture.detectChanges();
      });
      it('should NOT show right column', () => {
        expectBlockToRender(rightColSelector, false);
      });
      it('should show bottom row', () => {
        expectBlockToRender(bottomRowSelector, false);
      });
    });
    describe('LG', () => {
      beforeEach(() => {
        viewportSubject.next(ViewportType.LG);
        fixture.detectChanges();
      });
      it('should NOT show right column', () => {
        expectBlockToRender(rightColSelector, false);
      });
      it('should show bottom row', () => {
        expectBlockToRender(bottomRowSelector, false);
      });
    });
    describe('XL', () => {
      beforeEach(() => {
        viewportSubject.next(ViewportType.XL);
        fixture.detectChanges();
      });
      it('should show right column', () => {
        expectBlockToRender(rightColSelector, true);
      });
      it('should NOT show bottom row', () => {
        expectBlockToRender(bottomRowSelector, false);
      });
    });
    describe('XXL', () => {
      beforeEach(() => {
        viewportSubject.next(ViewportType.XXL);
        fixture.detectChanges();
      });
      it('should show right column', () => {
        expectBlockToRender(rightColSelector, true);
      });
      it('should NOT show bottom row', () => {
        expectBlockToRender(bottomRowSelector, false);
      });
    });
  });

  function expectBlockToRender(selector: Predicate<DebugElement>, shouldRender: boolean): void {
    const element = fixture.debugElement.query(selector);

    if (shouldRender) {
      expect(element).toBeTruthy();
    } else {
      expect(element).toBeFalsy();
    }
  }
});
