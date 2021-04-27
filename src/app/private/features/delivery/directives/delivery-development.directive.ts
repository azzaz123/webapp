import { Directive, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { FeatureflagService } from '@core/user/featureflag.service';

@Directive({
  selector: '[deliveryDevelopment]',
})
export class DeliveryDevelopmentDirective implements OnInit {
  constructor(
    private featureflagService: FeatureflagService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    if (this.featureflagService.getDeliveryFeatureFlag()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
