import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ParityScreenComponent } from './parity-screen.component';
// import { NON_PARITY_URLS } from '@configs/non-parity-urls.config';

const routes: Route[] = [
  {
    path: '',
    component: ParityScreenComponent,
  },
];

// const routes: Route[] = [
//   {
//     path: NON_PARITY_URLS.MEMBER_GET_MEMBER,
//     pathMatch: 'full',
//     component: ParityScreenComponent
//   },
//   {
//     path: NON_PARITY_URLS.WHATEVA,
//     pathMatch: 'full',
//     component: ParityScreenComponent
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParityScreenRoutingModule {}

export const parityScreenRoutedComponents = [ParityScreenComponent];
