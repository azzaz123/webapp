import { Directive, TemplateRef, ViewContainerRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';

@Directive({
  selector: '[tslDeliveryDevelopment]',
})
export class DeliveryDevelopmentDirective implements OnInit {
  constructor(
    private featureflagService: FeatureFlagService,
    private templateRef: TemplateRef<HTMLElement>,
    private viewContainer: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.removeElementFromDOM();

    this.featureflagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).subscribe((isActive: boolean) => {
      isActive ? this.addElementToDOM() : this.removeElementFromDOM();
      this.notifyChanges();
    });
  }

  private removeElementFromDOM(): void {
    this.viewContainer.clear();
  }

  private addElementToDOM(): void {
    this.viewContainer.createEmbeddedView(this.templateRef);
  }

  private notifyChanges(): void {
    this.changeDetectorRef.markForCheck();
  }
}
