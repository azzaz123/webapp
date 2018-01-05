import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-unsubscribe-modal',
  templateUrl: './unsubscribe-modal.component.html',
  styleUrls: ['./unsubscribe-modal.component.scss']
})
export class UnsubscribeModalComponent implements OnInit {

  public step = 1;
  public reasons: any[];
  public selectedReason: number;
  public customReason: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.reasons = [{
      id: 1,
      title: 'Ya no utilizo la app'
    }, {
      id: 2,
      title: 'No encuentro productos interesantes ni compradores interesados'
    }, {
      id: 3,
      title: 'Utilizo otra plataforma'
    }, {
      id: 4,
      title: 'Tengo problemas técnicos con el servicio'
    }, {
      id: 5,
      title: 'He tenido problemas de seguridad'
    }];
  }

  public send() {
    this.activeModal.close();
  }

}
