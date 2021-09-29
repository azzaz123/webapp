import { Directive, ElementRef, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const allowedKeys: string[] = ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Backspace', 'Delete', 'Tab'];

@Directive({
  selector: '[tslWalletTransferMaxLength]',
})
export class WalletTransferMaxLengthDirective {
  @Input()
  public tslWalletTransferMaxLength: number;

  constructor(@Inject(DOCUMENT) private document: Document, private element: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    if (this.isFull && !this.isAllowedKey(e.key) && !this.hasSelection) {
      e.preventDefault();
    }
  }

  private isAllowedKey(key: string): boolean {
    return !!allowedKeys.find((item) => item === key);
  }

  private get isFull(): boolean {
    return (
      this.tslWalletTransferMaxLength > 0 &&
      (this.element.nativeElement as HTMLInputElement).value.length >= this.tslWalletTransferMaxLength
    );
  }

  private get hasSelection(): boolean {
    return this.document.getSelection().toString().length > 0;
  }
}
