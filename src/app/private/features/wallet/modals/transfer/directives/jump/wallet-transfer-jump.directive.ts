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
    const range = this.document.getSelection().getRangeAt(0);
    const preCaretRange = range.cloneRange();
    const element = this.element;
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
