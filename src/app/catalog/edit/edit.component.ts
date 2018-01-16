import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'shield';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExitConfirmationModalComponent } from './exit-confirmation-modal/exit-confirmation-modal.component';

@Component({
  selector: 'tsl-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public item: Item;
  @ViewChild('scrollPanel') scrollPanel: ElementRef;
  private hasNotSavedChanges: boolean;

  constructor(private route: ActivatedRoute,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.item = this.route.snapshot.data['item'];
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

}
