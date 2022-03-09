import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS, PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';
import { AcceptScreenModalComponent } from './modals/accept-screen-modal/accept-screen-modal.component';
import { DELIVERY_MODAL_CLASSNAME } from '../delivery/constants/delivery-constants';
import { STREAMLINE_PATHS } from '../delivery/pages/streamline/streamline.routing.constants';
import { DELIVERY_PATHS } from '../delivery/delivery-routing-constants';

@Component({
  selector: 'tsl-accept-screen',
  template: '',
})
export class AcceptScreenComponent implements OnInit, OnDestroy {
  private readonly ONGOING_SELLS_LINK: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.SELLS}/${STREAMLINE_PATHS.ONGOING}`;
  private readonly TTS_LINK: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}`;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const requestId: string = this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
    const modalRef = this.modalService.open(AcceptScreenModalComponent, { windowClass: DELIVERY_MODAL_CLASSNAME, backdrop: 'static' });
    modalRef.componentInstance.requestId = requestId;

    modalRef.result.then(
      () => {
        this.navigateToOngoingSells();
      },
      () => {
        this.navigateToOngoingSells();
      }
    );
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  private navigateToOngoingSells(): void {
    const isRedirectingToTTS: boolean = this.router.url.includes(this.TTS_LINK);
    if (!isRedirectingToTTS) {
      this.router.navigate([this.ONGOING_SELLS_LINK]);
    }
  }
}
