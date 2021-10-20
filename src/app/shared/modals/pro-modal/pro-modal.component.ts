import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export enum MODAL_ACTION {
  PRIMARY_BUTTON,
  SECONDARY_BUTON,
}

@Component({
  selector: 'tsl-pro-modal',
  templateUrl: './pro-modal.component.html',
  styleUrls: ['./pro-modal.component.scss'],
})
export class ProModalComponent implements OnInit {
  modalConfig;
  public readonly MODAL_ACTION = MODAL_ACTION;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.modalConfig = {
      icon: '/assets/icons/pro/modals/pop-in-person.svg',
      title: 'simulacro',
      text1: 'La función de agregar servicios adicionales todavía no existe, estamos valorando posibilidades.',
      text2: '¡Gracias por tu ayuda! Tu participación ha sido muy valiosa. Nos ayudará a crear esta funcionalidad.',
      primaryButton: 'Ok',
    };
  }

  public onClose(action?: MODAL_ACTION): void {
    this.activeModal.close(action);
  }
}
