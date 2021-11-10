import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING } from '@fixtures/private/delivery/TTS/transaction-tracking.fixtures.spec';
import { ButtonComponent } from '@shared/button/button.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { of } from 'rxjs';

import { TransactionTrackingOverviewComponent } from './transaction-tracking-overview.component';

describe('TransactionTrackingOverviewComponent', () => {
  let component: TransactionTrackingOverviewComponent;
  let fixture: ComponentFixture<TransactionTrackingOverviewComponent>;
  let de: DebugElement;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Location],
      declarations: [TransactionTrackingOverviewComponent, ButtonComponent, SvgIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingOverviewComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
    location = TestBed.inject(Location);
    component.trackingInfo$ = of(MOCK_TRANSACTION_TRACKING);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have tracking info...', () => {
    let headerActionButton: DebugElement;

    beforeEach(() => {
      headerActionButton = fixture.debugElement.query(By.css('.TTS__buttonHeader'));
    });

    describe('the header section...', () => {
      it('should have the receieved title', () => {
        const title: HTMLElement = de.query(By.css('#headerTitle')).nativeElement;

        expect(title.textContent).toStrictEqual(MOCK_TRANSACTION_TRACKING.title);
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
          expect(headerActionButton.nativeElement.textContent).toEqual(MOCK_TRANSACTION_TRACKING.header.title);
        });

        it('should have the received state', () => {
          expect(headerActionButton.componentInstance.disabled).toBe(MOCK_TRANSACTION_TRACKING.header.state.isDisabled);
        });
      });

      describe('and we click on the action button...', () => {
        it('should open the link url in a new tab', () => {
          spyOn(window, 'open');

          headerActionButton.nativeElement.click();

          expect(window.open).toHaveBeenCalledTimes(1);
          expect(window.open).toHaveBeenCalledWith(MOCK_TRANSACTION_TRACKING.header.action.payload.linkUrl, '_blank');
        });
      });
    });
  });
});
