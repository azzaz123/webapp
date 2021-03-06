import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { DeeplinkService } from '@shared/deeplink/services/deeplink.service';
import { DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { environment } from '@environments/environment';
import { ErrorsService } from '@core/errors/errors.service';
import { ItemDetailRoutePipe, UserProfileRoutePipe } from '@shared/pipes';
import { ItemService } from '@core/item/item.service';
import {
  MOCK_TRANSACTION_TRACKING_INSTRUCTIONS,
  MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITHOUT_BANNER,
  MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITHOUT_FOOTER,
  MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITH_ADDITIONAL_INFO,
} from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-instructions.fixtures.spec';
import { MockSharedErrorActionService } from '@fixtures/private/wallet/shared/wallet-shared-error-action.fixtures.spec';
import { SharedErrorActionService } from '@shared/error-action';
import { SITE_URL } from '@configs/site-url.config';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { TransactionTrackingActionDeeplinkComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/transaction-tracking-action-details/transaction-tracking-action-deeplink/transaction-tracking-action-deeplink.component';
import { TransactionTrackingActionDialogComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/transaction-tracking-action-details/transaction-tracking-action-dialog/transaction-tracking-action-dialog.component';
import { TransactionTrackingActionSelectorComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/transaction-tracking-action-details/transaction-tracking-action-selector/transaction-tracking-action-selector.component';
import {
  TransactionTrackingActionType,
  TransactionTrackingService,
} from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTrackingBannerComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/banner/transaction-tracking-banner.component';
import { TransactionTrackingHeaderComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/sections';
import { TransactionTrackingInstructionsComponent } from '@private/features/delivery/pages/transaction-tracking-screen';
import { TransactionTrackingScreenStoreService } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';
import { TransactionTrackingScreenTrackingEventsService } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { UserService } from '@core/user/user.service';

import { of, throwError } from 'rxjs';

const fakeActionType: TransactionTrackingActionType = 'deeplink';
const fakeId: string = '123';
const transactionTrackingInstructionsSelector = `.TransactionTrackingInstructions`;
const transactionTrackingInstructionsHeaderSelector = `${transactionTrackingInstructionsSelector} tsl-transaction-tracking-header`;
const transactionTrackingInstructionsBannerSelector = `${transactionTrackingInstructionsSelector} tsl-transaction-tracking-banner`;
const transactionTrackingInstructionsTitleSelector = `${transactionTrackingInstructionsSelector}__title`;
const transactionTrackingInstructionsInstructionSelector = `${transactionTrackingInstructionsSelector}__instruction`;
const transactionTrackingInstructionsInstructionIndexSelector = `${transactionTrackingInstructionsInstructionSelector}-index`;
const transactionTrackingInstructionsInstructionDescriptionSelector = `${transactionTrackingInstructionsInstructionSelector}-description`;
const transactionTrackingInstructionsInstructionActionSelector = `${transactionTrackingInstructionsInstructionSelector}-action`;
const transactionTrackingInstructionsInstructionDescriptionActionSelector = `${transactionTrackingInstructionsInstructionDescriptionSelector} tsl-transaction-tracking-action-selector`;
const transactionTrackingInstructionsAdditionalInfoSelector = `${transactionTrackingInstructionsSelector}__additionalInfo`;
const transactionTrackingInstructionsAdditionalInfoTitleSelector = `${transactionTrackingInstructionsAdditionalInfoSelector}-title`;
const transactionTrackingInstructionsAdditionalInfoDescriptionSelector = `${transactionTrackingInstructionsAdditionalInfoSelector}-description`;
const transactionTrackingInstructionsFooterSelector = `${transactionTrackingInstructionsSelector}__footer`;
const transactionTrackingInstructionsFooterDescriptionSelector = `${transactionTrackingInstructionsFooterSelector}-description`;
const transactionTrackingInstructionsFooterActionSelector = `${transactionTrackingInstructionsFooterSelector}-action`;

describe('TransactionTrackingInstructionsComponent', () => {
  let component: TransactionTrackingInstructionsComponent;
  let fixture: ComponentFixture<TransactionTrackingInstructionsComponent>;
  let debugElement: DebugElement;
  let errorActionService: SharedErrorActionService;
  let transactionTrackingService: TransactionTrackingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BypassHTMLModule, HttpClientTestingModule],
      declarations: [
        ButtonComponent,
        SvgIconComponent,
        TransactionTrackingActionDeeplinkComponent,
        TransactionTrackingActionDialogComponent,
        TransactionTrackingActionSelectorComponent,
        TransactionTrackingBannerComponent,
        TransactionTrackingHeaderComponent,
        TransactionTrackingInstructionsComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === DELIVERY_PATH_PARAMS.ID) {
                    return fakeId;
                  }
                  if (key === DELIVERY_PATH_PARAMS.TYPE) {
                    return fakeActionType;
                  }
                  return 'bad param';
                },
              },
            },
          },
        },
        { provide: SITE_URL, useValue: environment.baseUrl },
        {
          provide: TransactionTrackingService,
          useValue: {
            getInstructions() {
              return of(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS);
            },
          },
        },
        {
          provide: TransactionTrackingScreenTrackingEventsService,
          useValue: {
            trackClickActionTTS() {},
          },
        },
        {
          provide: DeeplinkService,
          useValue: { navigate: () => {} },
        },
        ErrorsService,
        ItemDetailRoutePipe,
        {
          provide: SharedErrorActionService,
          useValue: MockSharedErrorActionService,
        },
        {
          provide: ItemService,
          useValue: {
            item: {
              webSlug: 'this_is_a_web_slug',
            },
          },
        },
        UserProfileRoutePipe,
        {
          provide: UserService,
          useValue: {
            user: {
              webSlug: 'this_is_a_web_slug',
            },
          },
        },
        TransactionTrackingScreenStoreService,
        {
          provide: Router,
          useValue: {
            url: '/path',
            navigate() {},
          },
        },
      ],
    }).compileComponents();
  });

  describe('WHEN we have the instructions properties defined...', () => {
    beforeEach(() => {
      transactionTrackingService = TestBed.inject(TransactionTrackingService);
      errorActionService = TestBed.inject(SharedErrorActionService);
      fixture = TestBed.createComponent(TransactionTrackingInstructionsComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call to the service with the corresponding parameters', () => {
      spyOn(transactionTrackingService, 'getInstructions').and.callThrough();

      component.ngOnInit();

      expect(transactionTrackingService.getInstructions).toHaveBeenCalledTimes(1);
      expect(transactionTrackingService.getInstructions).toBeCalledWith(fakeId, fakeActionType);
    });

    it('should show the provided header', () => {
      const header: HTMLElement = debugElement.query(By.css(transactionTrackingInstructionsHeaderSelector)).nativeElement;

      expect(header).toBeTruthy();
    });

    it('should show the provided banner', () => {
      const banner: HTMLElement = debugElement.query(By.css(transactionTrackingInstructionsBannerSelector)).nativeElement;

      expect(banner).toBeTruthy();
    });

    it('should show the title', () => {
      const expected = MOCK_TRANSACTION_TRACKING_INSTRUCTIONS.body.title;
      const title: HTMLElement = debugElement.query(By.css(transactionTrackingInstructionsTitleSelector)).nativeElement;

      expect(title).toBeTruthy();
      expect(title.innerHTML).toBe(expected);
    });

    it('should not show the additional info', () => {
      const additionalInfo: DebugElement = debugElement.query(By.css(transactionTrackingInstructionsAdditionalInfoSelector));

      expect(additionalInfo).toBeFalsy();
    });

    it('should not show the title of the additional info', () => {
      const title: DebugElement = debugElement.query(By.css(transactionTrackingInstructionsAdditionalInfoTitleSelector));

      expect(title).toBeFalsy();
    });

    it('should not show the description of the additional info', () => {
      const description: DebugElement = debugElement.query(By.css(transactionTrackingInstructionsAdditionalInfoDescriptionSelector));

      expect(description).toBeFalsy();
    });

    it('should show the footer', () => {
      const footer: DebugElement = debugElement.query(By.css(transactionTrackingInstructionsFooterSelector));

      expect(footer).toBeTruthy();
    });

    it('should show the footer description', () => {
      const description: DebugElement = debugElement.query(By.css(transactionTrackingInstructionsFooterDescriptionSelector));

      expect(description).toBeTruthy();
    });

    describe('WHEN there are some instructions', () => {
      it('should show the corresponding amount of instructions indexes', () => {
        const amount: number = debugElement.queryAll(By.css(transactionTrackingInstructionsInstructionIndexSelector)).length;

        expect(amount).toBe(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS.body.instructions.length);
      });
      it('should show the corresponding amount of instructions descriptions', () => {
        const amount: number = debugElement.queryAll(By.css(transactionTrackingInstructionsInstructionDescriptionSelector)).length;

        expect(amount).toBe(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS.body.instructions.length);
      });
      it('should show the corresponding amount of instructions without actions', () => {
        const expected = 1;
        const amount: number = debugElement.queryAll(By.css(transactionTrackingInstructionsInstructionActionSelector)).length;

        expect(amount).toBe(expected);
      });
      it('should show the corresponding amount of instructions with actions', () => {
        const expected = 2;
        const amount: number = debugElement.queryAll(By.css(transactionTrackingInstructionsInstructionDescriptionActionSelector)).length;

        expect(amount).toBe(expected);
      });
      it('should show all the instructions indexes', () => {
        const indexes: DebugElement[] = debugElement.queryAll(By.css(transactionTrackingInstructionsInstructionIndexSelector));

        indexes.forEach((value, index) => {
          const expected = index + 1;

          expect(value.nativeElement.innerHTML).toBe(expected.toString());
        });
      });
    });

    describe('WHEN there are some footer actions', () => {
      it('should show the corresponding amount of actions', () => {
        const amount: number = debugElement.queryAll(By.css(transactionTrackingInstructionsFooterActionSelector)).length;

        expect(amount).toBe(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS.footer.actions.length);
      });
    });
  });

  describe('WHEN the banner is not provided', () => {
    beforeEach(() => {
      transactionTrackingService = TestBed.inject(TransactionTrackingService);
      spyOn(transactionTrackingService, 'getInstructions').and.returnValue(of(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITHOUT_BANNER));
      fixture = TestBed.createComponent(TransactionTrackingInstructionsComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should not show the banner', () => {
      const banner: DebugElement = debugElement.query(By.css(transactionTrackingInstructionsBannerSelector));

      expect(banner).toBeFalsy();
    });
  });

  describe('WHEN the there are additional info', () => {
    beforeEach(() => {
      transactionTrackingService = TestBed.inject(TransactionTrackingService);
      spyOn(transactionTrackingService, 'getInstructions').and.returnValue(of(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITH_ADDITIONAL_INFO));
      fixture = TestBed.createComponent(TransactionTrackingInstructionsComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should show the additional info', () => {
      const additionalInfo: DebugElement = debugElement.query(By.css(transactionTrackingInstructionsAdditionalInfoSelector));

      expect(additionalInfo).toBeTruthy();
    });

    it('should show the title of the additional info', () => {
      const expected = MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITH_ADDITIONAL_INFO.body.additionalInfo.title;
      const title: HTMLElement = debugElement.query(By.css(transactionTrackingInstructionsAdditionalInfoTitleSelector)).nativeElement;

      expect(title).toBeTruthy();
      expect(title.innerHTML).toBe(expected);
    });

    it('should show the description of the additional info', () => {
      const expected = MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITH_ADDITIONAL_INFO.body.additionalInfo.description;
      const description: HTMLElement = debugElement.query(
        By.css(transactionTrackingInstructionsAdditionalInfoDescriptionSelector)
      ).nativeElement;

      expect(description).toBeTruthy();
      expect(description.innerHTML).toBe(expected);
    });
  });

  describe('WHEN the footer is not provided', () => {
    beforeEach(() => {
      transactionTrackingService = TestBed.inject(TransactionTrackingService);
      spyOn(transactionTrackingService, 'getInstructions').and.returnValue(of(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS_WITHOUT_FOOTER));
      fixture = TestBed.createComponent(TransactionTrackingInstructionsComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should not show the footer', () => {
      const footer: DebugElement = debugElement.query(By.css(transactionTrackingInstructionsFooterSelector));

      expect(footer).toBeFalsy();
    });
  });

  describe('WHEN there is an error retrieving the instructions list', () => {
    const MOCK_INSTRUCTIONS_ERROR = 'The server is broken';

    beforeEach(() => {
      transactionTrackingService = TestBed.inject(TransactionTrackingService);
      spyOn(transactionTrackingService, 'getInstructions').and.returnValue(throwError(MOCK_INSTRUCTIONS_ERROR));
      spyOn(errorActionService, 'show');

      fixture = TestBed.createComponent(TransactionTrackingInstructionsComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      fixture.detectChanges();
    });

    it('should show the generic error catcher', () => {
      expect(errorActionService.show).toHaveBeenCalledWith(MOCK_INSTRUCTIONS_ERROR);
      expect(errorActionService.show).toHaveBeenCalledTimes(1);
    });
  });
});
