import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { SlidesCarouselComponent } from '@shared/components/carousel-slides/carousel-slides.component';
import { WALLET_PATHS } from '../../wallet.routing.constants';
import { KYCTrackingEventsService } from '../kyc/services/kyc-tracking-events/kyc-tracking-events.service';
import { KYC_SLIDER_INFO_STEPS } from './kyc-info-modal-constants';

@Component({
  selector: 'tsl-kyc-info-modal',
  templateUrl: './kyc-info-modal.component.html',
  styleUrls: ['./kyc-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCInfoModalComponent implements OnInit {
  @ViewChild(SlidesCarouselComponent, { static: true }) slidesCarousel: SlidesCarouselComponent;
  public readonly KYC_LINK = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BALANCE}/${WALLET_PATHS.KYC}`;
  public readonly KYC_SLIDER_INFO_STEPS = KYC_SLIDER_INFO_STEPS;
  public readonly LAST_SLIDE = 'ngb-slide-2';

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private kycTrackingEventsService: KYCTrackingEventsService,
    private customerHelpService: CustomerHelpService
  ) {}

  ngOnInit(): void {
    this.kycTrackingEventsService.trackViewKYCTutorialScreen();
  }

  public swipeToRight(): void {
    this.slidesCarousel.carousel.next();
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public redirectToKYC(): void {
    this.requestTrackClickKYCStartVerification();
    this.router.navigate([this.KYC_LINK]);
    this.closeModal();
  }

  public get currentSlide(): string {
    return this.slidesCarousel.currentSlide;
  }

  public get zendeskURL(): string {
    return this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.VERIFY_MY_IDENTITY);
  }

  private requestTrackClickKYCStartVerification(): void {
    this.kycTrackingEventsService.trackClickKYCStartVerification();
  }
}
