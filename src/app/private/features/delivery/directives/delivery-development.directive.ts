import { Directive, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { FeatureflagService, FEATURE_FLAGS_ENUM } from '@core/user/featureflag.service';

@Directive({
  selector: '[tslDeliveryDevelopment]',
})
export class DeliveryDevelopmentDirective implements OnInit {
  constructor(
    private featureflagService: FeatureflagService,
    private templateRef: TemplateRef<HTMLElement>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    this.featureflagService.getFlag(FEATURE_FLAGS_ENUM.DELIVERY).subscribe((isActive: boolean) => {
      if (isActive) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
