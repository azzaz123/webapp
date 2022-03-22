import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DrawerNavigationProfileElementStubComponent } from '@fixtures/layout/drawer-navigation/components/drawer-navigation-profile-element.stub';
import { DrawerNavigationElementStubComponent } from '@fixtures/layout/drawer-navigation/components/drawer-navigation-element.stub';
import { MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT } from '@fixtures/layout/drawer-navigation/fixtures/drawer-navigation-profile-element.fixtures.spec';
import { of } from 'rxjs';
import { DRAWER_NAVIGATION_SECTIONS_COLLECTION } from '../constants/drawer-navigation-sections';
import { DrawerNavigationSection } from '../interfaces/drawer-navigation-element.interface';
import { DrawerNavigationService } from '../services/drawer-navigation.service';

import { DrawerNavigationComponent } from './drawer-navigation.component';

describe('DrawerNavigationComponent', () => {
  let component: DrawerNavigationComponent;
  let fixture: ComponentFixture<DrawerNavigationComponent>;

  const MOCK_DRAWER_NAVIGATION_SECTIONS: DrawerNavigationSection[] = Object.values(DRAWER_NAVIGATION_SECTIONS_COLLECTION);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: DrawerNavigationService,
          useValue: {
            navigationSections$: of(MOCK_DRAWER_NAVIGATION_SECTIONS),
            profileNavigationElement$: of(MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT),
          },
        },
      ],
      declarations: [DrawerNavigationComponent, DrawerNavigationElementStubComponent, DrawerNavigationProfileElementStubComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the component is rendered', () => {
    it('should show the profile navigation element', () => {
      const profileElement = fixture.debugElement.query(By.directive(DrawerNavigationProfileElementStubComponent)).componentInstance;

      expect(profileElement).toBeTruthy();
      expect(profileElement.element).toEqual(MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT);
    });

    it('should show all sections', () => {
      const sections = fixture.debugElement.queryAll(By.css('.DrawerNavigation__section'));

      expect(sections.length).toEqual(MOCK_DRAWER_NAVIGATION_SECTIONS.length);
    });

    it('should show the title of the section', () => {
      const title = fixture.debugElement.query(By.css('.DrawerNavigation__title')).nativeElement;

      expect(title.innerHTML).toEqual(MOCK_DRAWER_NAVIGATION_SECTIONS[0].title);
    });

    it('should show navigation elements per each of the sections', () => {
      const expectedNavigationElement = MOCK_DRAWER_NAVIGATION_SECTIONS[0].elements[0];

      const navigationElement = fixture.debugElement.query(By.directive(DrawerNavigationElementStubComponent)).componentInstance;

      expect(navigationElement.element).toEqual(expectedNavigationElement);
    });
  });
});
