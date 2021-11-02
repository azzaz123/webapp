import { Directive, ElementRef, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[tslWalletTransferJump]',
})
export class WalletTransferJumpDirective {
  @Input()
  public jumpAllowArrowLeft: boolean;
  @Input()
  public jumpAllowArrowRight: boolean;
  @Input()
  public jumpKey: string | string[];
  @Input()
  public jumpOnlyEmpty: boolean;
  @Input()
  public jumpTargetId: string;

  constructor(@Inject(DOCUMENT) private document: Document, private element: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    const code = e.code;
    const targete = this.element;
    debugger;
    if (!this.isJumpKey(code) || !this.jumpTargetId) {
      return;
    }

    const target = this.document.getElementById(this.jumpTargetId);

    if (!!target && this.isValidJump) {
      target.focus();
      e.preventDefault();
      (target as HTMLInputElement).select();
    }
  }

  private isJumpKey(code: string[] | string): boolean {
    const target = this.element.nativeElement;
    debugger;
    if (typeof this.jumpKey === 'string') {
      return code === this.jumpKey;
    }
    return !!this.jumpKey?.find((item) => item === code);
  }

  private get isValidJump(): boolean {
    return !this.jumpOnlyEmpty || (this.element.nativeElement as HTMLInputElement).value.length === 0;
  }
}
