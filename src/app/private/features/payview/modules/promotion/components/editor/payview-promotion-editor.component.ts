import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import {
  PAYVIEW_PROMOTION_DEFAULT_ERROR,
  PAYVIEW_PROMOTION_EDITOR_PROMOCODE_PLACEHOLDER,
  PAYVIEW_PROMOTION_EDITOR_TITLE,
  PAYVIEW_PROMOTION_EDITOR_TITLE_SEPARATOR,
  PAYVIEW_PROMOTION_ERRORS,
} from '@private/features/payview/modules/promotion/constants/payview-promotion-copies';
import { PAYVIEW_PROMOTION_EVENT_TYPE } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.enum';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';
import { PayviewPromotionService } from '@private/features/payview/modules/promotion/services/payview-promotion.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-payview-promotion-editor',
  templateUrl: './payview-promotion-editor.component.html',
  styleUrls: ['./payview-promotion-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewPromotionEditorComponent implements OnDestroy, OnInit {
  @Input() public promocode: string;

  public errorMessage: string;
  public firstSentence: string;
  public secondSentence: string;

  private subscription: Subscription;

  public constructor(private promotionService: PayviewPromotionService, private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public ngOnInit(): void {
    this.subscribe();
    this.loadTitle();
  }

  public apply(): void {
    this.promotionService.applyPromocode(this.promocode);
  }

  private getErrorMessage(error: PayviewError): string {
    return PAYVIEW_PROMOTION_ERRORS[error.code] ?? PAYVIEW_PROMOTION_DEFAULT_ERROR;
  }

  public get placeholder(): string {
    return PAYVIEW_PROMOTION_EDITOR_PROMOCODE_PLACEHOLDER;
  }

  private loadTitle(): void {
    const subtitles: string[] = PAYVIEW_PROMOTION_EDITOR_TITLE.split(PAYVIEW_PROMOTION_EDITOR_TITLE_SEPARATOR);
    this.firstSentence = `${subtitles[0]}.`;
    if (subtitles.length > 1) {
      this.secondSentence = `${subtitles[1]}.`;
    }
  }

  private subscribe(): void {
    this.subscription = this.promotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.ERROR, (error: PayviewError) => {
      this.errorMessage = this.getErrorMessage(error);
      this.changeDetectorRef.detectChanges();
    });
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
