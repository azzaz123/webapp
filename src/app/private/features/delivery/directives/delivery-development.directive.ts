import { Directive, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { FeatureflagService } from '@core/user/featureflag.service';

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
    if (this.featureflagService.getDeliveryFeatureFlag()) {
      console.log('inside iff!!!');
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
