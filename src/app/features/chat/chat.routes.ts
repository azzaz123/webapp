import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoggedGuard } from '@core/user/logged.guard';
import { ChatComponent } from './chat.component';

const routes: Route[] = [
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
