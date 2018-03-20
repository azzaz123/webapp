import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExitConfirmationModalComponent } from './exit-confirmation-modal/exit-confirmation-modal.component';
import { CanComponentDeactivate } from '../../shared/guards/can-component-deactivate.interface';
import { Item } from '../../core/item/item';
import { Product } from '../../core/item/item-response.interface';
import { ItemService } from '../../core/item/item.service';

@Component({
  selector: 'tsl-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, CanComponentDeactivate {

  public item: Item;
  @ViewChild('scrollPanel') scrollPanel: ElementRef;
  private hasNotSavedChanges: boolean;
  public urgentPrice: string = null;

  constructor(private route: ActivatedRoute,
              private modalService: NgbModal,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.item = this.route.snapshot.data['item'];
    this.getUrgentPrice(this.item.categoryId);
  }

  public onValidationError() {
    this.scrollPanel.nativeElement.scrollTop = 0;
  }

  public canExit() {
    if (!this.hasNotSavedChanges) {
      return true;
    }
    const modalRef: NgbModalRef = this.modalService.open(ExitConfirmationModalComponent, {
      backdrop: 'static'
    });
    modalRef.componentInstance.item = this.item;
    return modalRef.result;
  }

  public onFormChanged(notSavedChanges: boolean) {
    this.hasNotSavedChanges = notSavedChanges;
  }

  public getUrgentPrice(categoryId: number): void {
    this.itemService.getUrgentProductByCategoryId(categoryId).subscribe((product: Product) => {
      this.urgentPrice =  product.durations[0].market_code;
    });
  }

}
