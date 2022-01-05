import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { STREAMLINE_PATHS } from '@private/features/delivery/pages/streamline/streamline.routing.constants';
import { StreamlineComponent } from '@private/features/delivery/pages/streamline/streamline.component';
import { StreamlineTrackingEventsService } from '@private/features/delivery/pages/streamline/services/streamline-tracking-events/streamline-tracking-events.service';
import { TabsBarComponent } from '@shared/tabs-bar/components/tabs-bar/tabs-bar.component';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';

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
        {
          provide: Router,
          useValue: {
            navigate() {},
            get url() {
              return `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BUYS}`;
            },
          },
        },
      ],
      declarations: [StreamlineComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

      describe('WHEN the url correnponds to buys', () => {
        beforeEach(async () => {
          TestBed.resetTestingModule();
          await TestBed.configureTestingModule({
            imports: [RouterTestingModule, TabsBarModule],
            providers: [
              {
                provide: StreamlineTrackingEventsService,
                useValue: {
                  trackViewStreamlineScreen() {},
                },
              },
              {
                provide: Router,
                useValue: {
                  navigate() {},
                  get url() {
                    return `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BUYS}`;
                  },
                },
              },
            ],
            declarations: [StreamlineComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
          }).compileComponents();
        });

        beforeEach(() => {
          router = TestBed.inject(Router);
          streamlineTrackingEventsService = TestBed.inject(StreamlineTrackingEventsService);
          fixture = TestBed.createComponent(StreamlineComponent);
          component = fixture.componentInstance;

          fixture.detectChanges();

          spyOn(streamlineTrackingEventsService, 'trackViewStreamlineScreen');
          spyOn(router, 'navigate');
        });

        describe.each([[STREAMLINE_PATHS.ONGOING], [STREAMLINE_PATHS.COMPLETED]])('WHEN user selects filter', (filter) => {
          beforeEach(() => {
            ongoingFilter = component.tabsBarElements.find((te) => te.value === (filter as STREAMLINE_PATHS));
            const filtersDebugElement = fixture.debugElement.query(By.directive(TabsBarComponent));

            filtersDebugElement.triggerEventHandler('handleOnClick', ongoingFilter);
            fixture.detectChanges();
          });

          it('should navigate to specified route', () => {
            const expectedUrl: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BUYS}/${ongoingFilter.value}`;

            expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
          });
        });
      });

      describe('WHEN the url correnponds to sells', () => {
        beforeEach(async () => {
          TestBed.resetTestingModule();
          await TestBed.configureTestingModule({
            imports: [RouterTestingModule, TabsBarModule],
            providers: [
              {
                provide: StreamlineTrackingEventsService,
                useValue: {
                  trackViewStreamlineScreen() {},
                },
              },
              {
                provide: Router,
                useValue: {
                  navigate() {},
                  get url() {
                    return `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.SELLS}`;
                  },
                },
              },
            ],
            declarations: [StreamlineComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
          }).compileComponents();
        });

        beforeEach(() => {
          router = TestBed.inject(Router);
          streamlineTrackingEventsService = TestBed.inject(StreamlineTrackingEventsService);
          fixture = TestBed.createComponent(StreamlineComponent);
          component = fixture.componentInstance;

          fixture.detectChanges();

          spyOn(streamlineTrackingEventsService, 'trackViewStreamlineScreen');
          spyOn(router, 'navigate');
        });

        describe.each([[STREAMLINE_PATHS.ONGOING], [STREAMLINE_PATHS.COMPLETED]])('WHEN user selects filter', (filter) => {
          beforeEach(() => {
            ongoingFilter = component.tabsBarElements.find((te) => te.value === (filter as STREAMLINE_PATHS));
            const filtersDebugElement = fixture.debugElement.query(By.directive(TabsBarComponent));

            filtersDebugElement.triggerEventHandler('handleOnClick', ongoingFilter);
            fixture.detectChanges();
          });

          it('should navigate to specified route', () => {
            const expectedUrl: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.SELLS}/${ongoingFilter.value}`;

            expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
          });
        });
      });
    });

    describe('and when the page is for the ongoing transactions', () => {
      beforeEach(() => mockRouterUrl(STREAMLINE_PATHS.ONGOING));

      it('should select the ongoing tab as active', () => {
        const ongoingTabsBarElement = component.tabsBarElements.find((t) => t.value === STREAMLINE_PATHS.ONGOING);
        const result = getTabsBarComponent().initialSelectedTabBarElement;

        expect(result).toBe(ongoingTabsBarElement);
      });
    });

    describe('and when the page is for the completed transactions', () => {
      beforeEach(() => mockRouterUrl(STREAMLINE_PATHS.COMPLETED));

      it('should select the completed tab as active', () => {
        const completedTabsBarElement = component.tabsBarElements.find((t) => t.value === STREAMLINE_PATHS.COMPLETED);
        const result = getTabsBarComponent().initialSelectedTabBarElement;

        expect(result).toBe(completedTabsBarElement);
      });
    });

    describe('and when the page is not a known tab', () => {
      beforeEach(() => mockRouterUrl('gibberish'));

      it('should select the ongoing tab as active', () => {
        const ongoingTabsBarElement = component.tabsBarElements.find((t) => t.value === STREAMLINE_PATHS.ONGOING);
        const result = getTabsBarComponent().initialSelectedTabBarElement;

        expect(result).toBe(ongoingTabsBarElement);
      });
    });
  });

  function mockRouterUrl(url: string): void {
    jest.spyOn(router, 'url', 'get').mockReturnValue(url);
    component.ngOnInit();
    fixture.detectChanges();
  }

  function getTabsBarComponent(): TabsBarComponent<STREAMLINE_PATHS> {
    return fixture.debugElement.query(By.directive(TabsBarComponent)).componentInstance;
  }
});
