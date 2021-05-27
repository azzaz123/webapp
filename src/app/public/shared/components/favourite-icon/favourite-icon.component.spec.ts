import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

import { FavouriteIconComponent } from './favourite-icon.component';

describe('FavouriteIconComponent', () => {
  let component: FavouriteIconComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let iconElement: Element;
  let fixture: ComponentFixture<FavouriteIconComponent>;
  const activeClassName = 'FavouriteIcon--active';
  const redStrokeClassName = 'FavouriteIcon--redStroke';

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
    iconElement = el.querySelector('tsl-svg-icon');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when icon is active', () => {
    beforeEach(() => (component.active = true));

    it('should style icon as active', () => {
      fixture.detectChanges();

      expect(iconElement.className).toContain(activeClassName);
    });

    describe('and when icon stroke should be red', () => {
      beforeEach(() => (component.redStroke = true));

      it('should NOT style icon with red stroke', () => {
        fixture.detectChanges();

        expect(iconElement.className).not.toContain(redStrokeClassName);
      });
    });
  });

  describe('when icon is not active', () => {
    beforeEach(() => (component.active = false));

    it('should style icon as not active', () => {
      fixture.detectChanges();

      expect(iconElement.className).not.toContain(activeClassName);
    });

    describe('and when icon stroke should be red', () => {
      beforeEach(() => (component.redStroke = true));

      it('should style icon with red stroke', () => {
        fixture.detectChanges();

        expect(iconElement.className).toContain(redStrokeClassName);
      });
    });
  });
});
