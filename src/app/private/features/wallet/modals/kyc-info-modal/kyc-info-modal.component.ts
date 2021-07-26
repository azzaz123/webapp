import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { SlidesCarouselComponent } from '@shared/components/carousel-slides/carousel-slides.component';
import { WALLET_PATHS } from '../../wallet.routing.constants';
import { KYC_SLIDER_INFO_STEPS } from './kyc-info-modal-constants';

@Component({
  selector: 'tsl-kyc-info-modal',
  templateUrl: './kyc-info-modal.component.html',
  styleUrls: ['./kyc-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KYCInfoModalComponent {
  @ViewChild(SlidesCarouselComponent, { static: true }) slidesCarousel: SlidesCarouselComponent;
  public readonly KYC_LINK = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BALANCE}/${WALLET_PATHS.KYC}`;
  public readonly KYC_SLIDER_INFO_STEPS = KYC_SLIDER_INFO_STEPS;
  public readonly LAST_SLIDE = 'ngb-slide-2';
  public readonly ZENDESK_ID = '360004532117';

  constructor(public activeModal: NgbActiveModal, private router: Router) {}

  public swipeToRight(): void {
    this.slidesCarousel.carousel.next();
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public redirectToKYC(): void {
    this.router.navigate([this.KYC_LINK]);
    this.closeModal();
  }

  get currentSlide(): string {
    return this.slidesCarousel.currentSlide;
  }

  get zendeskURL(): string {
    // TODO: change it and use the zendesk service		Date: 2021/07/13
    return `https://ayuda.wallapop.com/hc/en-us/articles/${this.ZENDESK_ID}-Verify-my-identity`;
  }
}
