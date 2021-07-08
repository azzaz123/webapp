import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { SlidesCarouselComponent } from '@shared/components/carousel-slides/carousel-slides.component';
import { WALLET_PATHS } from '../../wallet-routing-constants';
import { KYC_SLIDER_INFO_STEPS } from './kyc-info-modal-constants';

@Component({
  selector: 'tsl-kyc-info-modal',
  templateUrl: './kyc-info-modal.component.html',
  styleUrls: ['./kyc-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KycInfoModalComponent {
  @ViewChild(SlidesCarouselComponent, { static: true }) slidesCarousel: SlidesCarouselComponent;
  public readonly KYC_LINK = `${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.KYC}`;
  public readonly KYC_SLIDER_INFO_STEPS = KYC_SLIDER_INFO_STEPS;
  public readonly LAST_SLIDE = 'ngb-slide-2';

  constructor(public activeModal: NgbActiveModal, private router: Router) {}

  public swipeToRight(): void {
    this.slidesCarousel.carousel.next();
  }

  public redirectToKYC(): void {
    this.router.navigate([this.KYC_LINK]);
  }

  get currentSlide(): string {
    return this.slidesCarousel.currentSlide;
  }
}
