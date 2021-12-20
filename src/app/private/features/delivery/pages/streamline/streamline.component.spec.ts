import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
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
      const expectedTabs = component.tabsBarElements;
      const childComponentTabs = getTabsBarComponent().tabsBarElements;

      expect(childComponentTabs).toBe(expectedTabs);
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

    describe('and when the page is for the ongoing transactions', () => {
      beforeEach(() => {
        jest.spyOn(router, 'url', 'get').mockReturnValue(STREAMLINE_PATHS.ONGOING);
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should select the ongoing tab as active', () => {
        const ongoingTabsBarElement = component.tabsBarElements.find((t) => t.value === STREAMLINE_PATHS.ONGOING);
        const result = getTabsBarComponent().initialSelectedTabBarElement;

        expect(result).toBe(ongoingTabsBarElement);
      });
    });

    describe('and when the page is for the completed transactions', () => {
      beforeEach(() => {
        jest.spyOn(router, 'url', 'get').mockReturnValue(STREAMLINE_PATHS.COMPLETED);
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should select the completed tab as active', () => {
        const completedTabsBarElement = component.tabsBarElements.find((t) => t.value === STREAMLINE_PATHS.COMPLETED);
        const result = getTabsBarComponent().initialSelectedTabBarElement;

        expect(result).toBe(completedTabsBarElement);
      });
    });
  });

  function getTabsBarComponent(): TabsBarComponent<STREAMLINE_PATHS> {
    return fixture.debugElement.query(By.directive(TabsBarComponent)).componentInstance;
  }
});
