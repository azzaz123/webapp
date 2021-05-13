import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item, ITEM_TYPES } from '@core/item/item';
import { Product } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExitConfirmationModalComponent } from '@shared/exit-confirmation-modal/exit-confirmation-modal.component';
import { CanComponentDeactivate } from '@core/guards/can-component-deactivate.interface';
import { UPLOAD_PATHS } from '../../upload-routing-constants';
import { EditTrackingEventService } from './service/edit-tracking-event.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tsl-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, CanComponentDeactivate {
  public item: Item;
  @ViewChild('scrollPanel', { static: true }) scrollPanel: ElementRef;
  private hasNotSavedChanges: boolean;
  public urgentPrice: string = null;
  public itemTypes: any = ITEM_TYPES;
  public isReactivation = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private itemService: ItemService,
    private userService: UserService,
    private editTrackingEventService: EditTrackingEventService
  ) {
    this.userService.isProfessional().subscribe((isPro: boolean) => {
      const id = route.snapshot.params['id'];
      if (isPro && !route.snapshot.parent.parent.parent.url.length) {
        this.router.navigate(['/pro/catalog/edit/' + id]);
      } else if (!isPro && route.snapshot.parent.parent.parent.url.length) {
        this.router.navigate(['/catalog/edit/' + id]);
      }
    });
  }

  ngOnInit() {
    this.item = this.route.snapshot.data['item'];
    this.isReactivation = this.router.url.endsWith(UPLOAD_PATHS.REACTIVATE);
    this.getUrgentPrice();

    this.editTrackingEventService.viewTrackingReady$.pipe(take(1)).subscribe(() => {
      this.editTrackingEventService.trackViewEditItemEvent(this.item.categoryId, this.isReactivation);
    });
  }

  public onValidationError() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

  public canExit() {
    if (!this.hasNotSavedChanges) {
      return true;
    }
    const modalRef: NgbModalRef = this.modalService.open(ExitConfirmationModalComponent, {
      backdrop: 'static',
    });
    modalRef.componentInstance.item = this.item;
    return modalRef.result;
  }

  public onFormChanged(notSavedChanges: boolean) {
    this.hasNotSavedChanges = notSavedChanges;
  }

  public getUrgentPrice(): void {
    this.itemService.getUrgentProducts(this.item.id).subscribe((product: Product) => {
      this.urgentPrice = product.durations[0].market_code;
    });
  }
}
