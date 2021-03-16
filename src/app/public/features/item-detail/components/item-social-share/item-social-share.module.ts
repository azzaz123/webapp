import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SocialShareModule } from '@shared/social-share/social-share.module';
import { ItemSocialShareComponent } from './item-social-share.component';

@NgModule({
  declarations: [ItemSocialShareComponent],
  imports: [CommonModule, SocialShareModule],
  exports: [ItemSocialShareComponent],
})
export class ItemSocialShareModule {}
