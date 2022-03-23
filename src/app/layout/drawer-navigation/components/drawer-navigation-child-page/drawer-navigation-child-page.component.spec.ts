import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DrawerNavigationElementStubComponent } from '@fixtures/layout/drawer-navigation/components/drawer-navigation-element.stub';
import { SvgIconStubComponent } from '@fixtures/shared/components/svg-icon.component.stub';
import { DrawerNavigationService } from '@layout/drawer-navigation/services/drawer-navigation.service';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PROFILE_PATHS } from '@private/features/profile/profile-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { of } from 'rxjs';

import { DrawerNavigationChildPageComponent } from './drawer-navigation-child-page.component';

describe('DrawerNavigationChildPageComponent', () => {
  let component: DrawerNavigationChildPageComponent;
  let fixture: ComponentFixture<DrawerNavigationChildPageComponent>;

  const MOCK_PAGE_TITLE: string = 'Settings';
  const MOCK_NAVIGATION_ELEMENTS = [
    {
      text: 'Editar perfil',
      alternativeText: 'Editar perfil',
      external: false,
      href: `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.INFO}`,
    },
    {
      text: 'Verificaciones y seguridad',
      alternativeText: 'Verificaciones y seguridad',
      external: false,
      href: `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.VERIFICATIONS}`,
    },
    {
      text: 'Dirección de envío',
      alternativeText: 'Dirección de envío',
      external: false,
      href: `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.ADDRESS}`,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrawerNavigationChildPageComponent, SvgIconStubComponent, DrawerNavigationElementStubComponent],
      providers: [
        {
          provide: DrawerNavigationService,
          useValue: {
            getChildNavigationElements: () => of(MOCK_NAVIGATION_ELEMENTS),
            getChildNavigationTitle: () => of(MOCK_PAGE_TITLE),
          },
        },
        {
          provide: Router,
          useValue: {
            url: '',
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerNavigationChildPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the component is rendered', () => {
    it('should show the proper title for the current page', () => {
      const titleElement = fixture.debugElement.query(By.css('.DrawerNavigationChildPage__title')).nativeElement;

      expect(titleElement.innerHTML).toEqual(MOCK_PAGE_TITLE);
    });

    it('should render all navigation elements', () => {
      const navigationElements = fixture.debugElement.queryAll(By.directive(DrawerNavigationElementStubComponent));

      expect(navigationElements.length).toEqual(MOCK_NAVIGATION_ELEMENTS.length);
    });
  });
});
