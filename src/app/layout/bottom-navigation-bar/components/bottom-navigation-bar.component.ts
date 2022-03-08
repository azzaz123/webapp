import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { BottomNavigationBarElement } from '../interfaces/bottom-navigation-bar-element.interface';
import { BottomNavigationBarService } from '../services/bottom-navigation-bar.service';

export const INPUT_TYPE = {
  TEXT: 'text',
  DATE: 'date',
  PASSWORD: 'password',
  NUMBER: 'number',
  radio: 'radio',
};

export const KEYBOARD_INPUT_TYPES = [INPUT_TYPE.TEXT, INPUT_TYPE.DATE, INPUT_TYPE.PASSWORD, INPUT_TYPE.NUMBER];

export const ELEMENT_TYPE = {
  TEXT_AREA: 'TEXTAREA',
  INPUT: 'INPUT',
};

@Component({
  selector: 'tsl-bottom-navigation-bar',
  templateUrl: './bottom-navigation-bar.component.html',
  styleUrls: ['./bottom-navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavigationBarComponent {
  public readonly navigationElements$: Observable<BottomNavigationBarElement[]> = this.bottomNavigationBarService.navigationElements$;
  public readonly hidden$: Observable<boolean> = this.bottomNavigationBarService.hidden$;

  constructor(private bottomNavigationBarService: BottomNavigationBarService) {}

  @HostListener('window:focusin', ['$event'])
  onFocusIn(elementType: unknown) {
    if (this.isTextInputOrTextarea(elementType)) {
      this.bottomNavigationBarService.hideNavigationBar();
    }
  }

  @HostListener('window:focusout', ['$event'])
  onFocusOut(elementType: unknown) {
    if (this.isTextInputOrTextarea(elementType)) {
      this.bottomNavigationBarService.showNavigationBar();
    }
  }

  private isTextInputOrTextarea(element: any): boolean {
    const elementTarget = element.target;
    if (elementTarget.nodeName === ELEMENT_TYPE.TEXT_AREA) {
      return true;
    }

    if (elementTarget.nodeName !== ELEMENT_TYPE.INPUT) {
      return false;
    }

    const inputType = elementTarget.attributes?.type?.nodeValue;
    return KEYBOARD_INPUT_TYPES.includes(inputType);
  }
}
