import { ComponentRef, Directive } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

export interface OnAttach {
  onAttach(activatedRoute: ActivatedRoute): void;
}
export interface OnDetach {
  onDetach(): void;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'public-router-outlet',
})
export class PublicRouterOutletDirective extends RouterOutlet {
  detach(): ComponentRef<any> {
    const instance: any = this.component;
    if (instance && typeof instance.onDetach === 'function') {
      instance.onDetach();
    }
    return super.detach();
  }
  attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    super.attach(ref, activatedRoute);
    if (ref.instance && typeof ref.instance.onAttach === 'function') {
      ref.instance.onAttach(activatedRoute);
    }
  }
}
