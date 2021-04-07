import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ERROR_BOX_EXIT_TYPE } from './interfaces/error-box-exit-type';
import { ErrorBoxExit } from './interfaces/error-box-exit.interface';
@Component({
  selector: 'tsl-error-box',
  templateUrl: './error-box.component.html',
  styleUrls: ['./error-box.component.scss'],
})
export class ErrorBoxComponent {
  @Input() img: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() exit: ErrorBoxExit;

  @Output() exitClick: EventEmitter<void> = new EventEmitter<void>();

  readonly ERROR_BOX_EXIT_TYPE = ERROR_BOX_EXIT_TYPE;

  constructor() {}
}
