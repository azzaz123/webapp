import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { CommunicationsConsentComponent } from './communications-consent.component';

const routes: Route[] = [
  {
    path: '',
    component: CommunicationsConsentComponent,
    canDeactivate: [ExitConfirmGuard],
    data: {
      isMyZone: true,
      isProfile: true,
    },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationsConsentRoutingModule {}

export const CommunicationsConsentRoutedComponents = [CommunicationsConsentComponent];
