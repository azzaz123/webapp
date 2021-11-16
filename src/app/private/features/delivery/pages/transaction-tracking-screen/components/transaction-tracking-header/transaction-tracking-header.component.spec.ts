import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';
import { ButtonComponent } from '@shared/button/button.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

import { TransactionTrackingHeaderComponent } from './transaction-tracking-header.component';

describe('TransactionTrackingHeaderComponent', () => {
  let component: TransactionTrackingHeaderComponent;
  let fixture: ComponentFixture<TransactionTrackingHeaderComponent>;
  let transactionTrackingActionsService: TransactionTrackingActionsService;
  let de: DebugElement;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionTrackingActionsService],
      declarations: [TransactionTrackingHeaderComponent, ButtonComponent, SvgIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingHeaderComponent);
    component = fixture.componentInstance;
    transactionTrackingActionsService = TestBed.inject(TransactionTrackingActionsService);
    location = TestBed.inject(Location);
    de = fixture.debugElement;
    component.transactionTrackingHeader = MOCK_TRANSACTION_TRACKING.header;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have transaction tracking header info...', () => {
    let headerActionButton: DebugElement;

    beforeEach(() => {
      headerActionButton = fixture.debugElement.query(By.css('.TTS__buttonHeader'));
    });

    describe('the header section...', () => {
      it('should have the receieved title', () => {
        const title: HTMLElement = de.query(By.css('#headerTitle')).nativeElement;

        expect(title.textContent).toStrictEqual(MOCK_TRANSACTION_TRACKING.header.title);
      });

      describe('and we click on the go back button...', () => {
        it('should go back to the previous page', () => {
          spyOn(location, 'back');

          const button: HTMLElement = fixture.debugElement.query(By.css('.TTS__back')).nativeElement;
          button.click();

          expect(location.back).toHaveBeenCalledTimes(1);
        });
      });

      describe('the action button...', () => {
        it('should have the received title', () => {
          expect(headerActionButton.nativeElement.textContent).toEqual(MOCK_TRANSACTION_TRACKING.header.detail.title);
        });

        it('should have the received state', () => {
          expect(headerActionButton.componentInstance.disabled).toBe(MOCK_TRANSACTION_TRACKING.header.detail.state.isDisabled);
        });
      });

      describe('and we click on the action button...', () => {
        it('should call the transaction tracking actions service', () => {
          spyOn(transactionTrackingActionsService, 'manageAction');

          headerActionButton.nativeElement.click();

          expect(transactionTrackingActionsService.manageAction).toHaveBeenCalledTimes(1);
          expect(transactionTrackingActionsService.manageAction).toHaveBeenCalledWith(MOCK_TRANSACTION_TRACKING.header.detail.action);
        });
      });
    });
  });
});
