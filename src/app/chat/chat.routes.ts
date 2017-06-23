import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './chat.component';
import { LoggedGuard } from 'shield';

const routes: Routes = [
  {path: 'chat', component: ChatComponent, canActivate: [LoggedGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {
}

export const chatRoutedComponents = [ChatComponent];
