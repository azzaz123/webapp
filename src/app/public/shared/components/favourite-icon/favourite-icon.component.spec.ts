import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

import { FavouriteIconComponent } from './favourite-icon.component';

describe('FavouriteIconComponent', () => {
  let component: FavouriteIconComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<FavouriteIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgIconModule, HttpClientTestingModule],
      declarations: [FavouriteIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteIconComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when active status changes', () => {
    const activeClassName = 'FavouriteIcon--active';
    let elementToCheck: Element;

    beforeEach(() => {
      elementToCheck = el.querySelector('tsl-svg-icon');
    });

    it('should have active status if is active ', () => {
      component.active = true;

      fixture.detectChanges();

      expect(elementToCheck.className).toContain(activeClassName);
    });

    it('should have inactive status if is NOT active ', () => {
      component.active = false;

      fixture.detectChanges();

      expect(elementToCheck.className).not.toContain(activeClassName);
    });
  });
});
