import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { TabComponent } from '@shared/tabs-bar/components/tab/tab.component';
import { TabsBarComponent } from '@shared/tabs-bar/components/tabs-bar/tabs-bar.component';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { DELIVERY_PATHS } from '../../delivery-routing-constants';
import { StreamlineTrackingEventsService } from './services/streamline-tracking-events/streamline-tracking-events.service';

import { StreamlineComponent } from './streamline.component';
import { STREAMLINE_PATHS } from './streamline.routing.constants';

describe('StreamlineComponent', () => {
  let component: StreamlineComponent;
  let fixture: ComponentFixture<StreamlineComponent>;
  let router: Router;
  let streamlineTrackingEventsService: StreamlineTrackingEventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TabsBarModule],
      providers: [
        {
          provide: StreamlineTrackingEventsService,
          useValue: {
            trackViewStreamlineScreen() {},
          },
        },
      ],
      declarations: [StreamlineComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamlineComponent);
    router = TestBed.inject(Router);
    streamlineTrackingEventsService = TestBed.inject(StreamlineTrackingEventsService);
    component = fixture.componentInstance;

    spyOn(streamlineTrackingEventsService, 'trackViewStreamlineScreen');
    fixture.detectChanges();

    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user enters page', () => {
    it('should track the page view event', () => {
      expect(streamlineTrackingEventsService.trackViewStreamlineScreen).toHaveBeenCalledTimes(1);
    });

    it('should show all filters', () => {
      const tabsDebugElements = fixture.debugElement.queryAll(By.directive(TabComponent));
      const expectedNumberOfFilters = Object.values(STREAMLINE_PATHS).filter((v) => typeof v === 'string').length;
      const findTabBarComponentByElement = (de: DebugElement, tabBarElement: TabsBarElement<STREAMLINE_PATHS>) => {
        const tabBarComponentInstance: TabComponent<STREAMLINE_PATHS> = de.componentInstance;
        return tabBarComponentInstance.tabsBarElement.label === tabBarElement.label;
      };
      const expectAllFiltersToHaveATab = () => {
        component.tabsBarElements.forEach((tabBarElement) => {
          const foundTabBar = tabsDebugElements.find((de) => findTabBarComponentByElement(de, tabBarElement));
          expect(foundTabBar).toBeTruthy();
        });
      };

      expect(tabsDebugElements.length).toEqual(expectedNumberOfFilters);
      expectAllFiltersToHaveATab();
    });

    it('should redirect to the ongoing shippings page', () => {
      const expectedUrl: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.STREAMLINE}/${STREAMLINE_PATHS.ONGOING}`;

      component.ngOnInit();

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
    });

    describe('and when user clicks on a tab bar', () => {
      let ongoingFilter: TabsBarElement<STREAMLINE_PATHS>;

      beforeEach(() => {
        ongoingFilter = component.tabsBarElements.find((te) => te.value === STREAMLINE_PATHS.ONGOING);
        const filtersDebugElement = fixture.debugElement.query(By.directive(TabsBarComponent));

        filtersDebugElement.triggerEventHandler('onChange', ongoingFilter);
        fixture.detectChanges();
      });

      it('should navigate to specified route', () => {
        const expectedUrl: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.STREAMLINE}/${ongoingFilter.value}`;

        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });
  });
});
