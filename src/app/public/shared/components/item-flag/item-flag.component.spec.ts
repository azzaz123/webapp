import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ITEM_FLAG_TYPES } from './item-flag-constants';

import { ItemFlagComponent } from './item-flag.component';

describe('ItemFlagComponent', () => {
  let component: ItemFlagComponent;
  let fixture: ComponentFixture<ItemFlagComponent>;
  const svgTag = 'tsl-svg-icon';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemFlagComponent],
      imports: [SvgIconModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we pass an item type...', () => {
    beforeEach(() => {
      component.type = ITEM_FLAG_TYPES.SOLD;

      fixture.detectChanges();
    });

    it('should load the icon', () => {
      const svgComponent: HTMLElement = fixture.nativeElement.querySelector(
        `.ItemFlag > ${svgTag}`
      );

      expect(svgComponent).toBeTruthy();
      expect(svgComponent.getAttribute('ng-reflect-src')).toContain(
        component.type.toLocaleLowerCase()
      );
    });

    it('should load the ng-content container', () => {
      const ngContent: HTMLElement = fixture.nativeElement.querySelector(
        `.ItemFlag > .ItemFlag__content`
      );

      expect(ngContent).toBeTruthy();
    });
  });
});
