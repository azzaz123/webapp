import { NgModule } from '@angular/core';
import { createDisputeRoutedComponents, CreateDisputeRoutingModule } from './create-dispute.routing.module';

@NgModule({
  imports: [CreateDisputeRoutingModule],
  declarations: [createDisputeRoutedComponents],
})
export class CreateDisputeModule {}
