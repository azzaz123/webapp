import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './chat.component';
import { LoggedGuard } from '@core/user/logged.guard';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    canActivate: [LoggedGuard],
    data: {
      title: 'Chat',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}

export const chatRoutedComponents = [ChatComponent];
