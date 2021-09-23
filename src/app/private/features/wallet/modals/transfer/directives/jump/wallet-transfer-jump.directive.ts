import { Directive, ElementRef, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[tslWalletTransferJump]',
})
export class WalletTransferJumpDirective {
  @Input()
  public jumpKey: string | string[];
  @Input()
  public jumpOnlyEmpty: boolean;
  @Input()
  public jumpTargetId: string;

  constructor(@Inject(DOCUMENT) private document: Document, private element: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    const key = e.key;

    if (!this.isJumpKey(key) || !this.jumpTargetId) {
      return;
    }

    const target = this.document.getElementById(this.jumpTargetId);

    if (!!target && this.isValidJump) {
      target.focus();
      (target as HTMLInputElement).select();
      e.preventDefault();
    }
  }

  private isJumpKey(key: string[] | string): boolean {
    if (typeof this.jumpKey === 'string') {
      return key === this.jumpKey;
    }
    return !!this.jumpKey?.find((item) => item === key);
  }

  private get isValidJump(): boolean {
    return !this.jumpOnlyEmpty || (this.element.nativeElement as HTMLInputElement).value.length === 0;
  }
}
