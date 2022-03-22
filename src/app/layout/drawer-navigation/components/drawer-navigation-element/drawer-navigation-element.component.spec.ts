import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SvgIconStubComponent } from '@fixtures/shared/components/svg-icon.component.stub';
import { DRAWER_NAVIGATION_SECTIONS_COLLECTION } from '@layout/drawer-navigation/constants/drawer-navigation-sections';
import { DrawerNavigationElement } from '@layout/drawer-navigation/interfaces/drawer-navigation-element.interface';

import { DrawerNavigationElementComponent } from './drawer-navigation-element.component';

const MOCK_DRAWER_NAVIGATION_ELEMENT: DrawerNavigationElement = Object.values(DRAWER_NAVIGATION_SECTIONS_COLLECTION)[0].elements[0];

describe('DrawerNavigationElementComponent', () => {
  let component: DrawerNavigationElementComponent;
  let fixture: ComponentFixture<DrawerNavigationElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DrawerNavigationElementComponent, SvgIconStubComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerNavigationElementComponent);
    component = fixture.componentInstance;
    component.element = MOCK_DRAWER_NAVIGATION_ELEMENT;
  });

  describe('when the component is rendered', () => {
    it('should show the proper icon', () => {
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.directive(SvgIconStubComponent)).componentInstance;

      expect(icon.src).toEqual(MOCK_DRAWER_NAVIGATION_ELEMENT.icon);
    });

    it('should show the proper text', () => {
      fixture.detectChanges();

      const text = fixture.debugElement.query(By.css('.DrawerNavigationElement__text')).nativeElement.innerHTML;

      expect(text).toEqual(MOCK_DRAWER_NAVIGATION_ELEMENT.text);
    });

    describe('and the navigation should be handled internally', () => {
      it('should open the link in the same tab', () => {
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.css('.DrawerNavigationElement')).nativeElement;

        expect(element.getAttribute('ng-reflect-router-link')).toEqual(MOCK_DRAWER_NAVIGATION_ELEMENT.href);
      });
    });

    describe('and the navigation should be handled externally', () => {
      it('should open the link in a new tab', () => {
        const MOCK_DRAWER_NAVIGATION_ELEMENT_EXTERNAL: DrawerNavigationElement = { ...MOCK_DRAWER_NAVIGATION_ELEMENT, external: true };

        component.element = MOCK_DRAWER_NAVIGATION_ELEMENT_EXTERNAL;
        fixture.detectChanges();
        const element = fixture.debugElement.query(By.css('.DrawerNavigationElement')).nativeElement;

        expect(element.attributes).not.toContain('ng-reflect-router-link');
        expect(element.getAttribute('target')).toEqual('_blank');
        expect(element.getAttribute('href')).toEqual(MOCK_DRAWER_NAVIGATION_ELEMENT_EXTERNAL.href);
      });
    });
  });
});
