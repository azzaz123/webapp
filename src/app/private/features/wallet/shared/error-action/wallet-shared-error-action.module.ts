import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WalletSharedErrorActionComponent } from './components/error-action/wallet-shared-error-action.component';

@NgModule({
  declarations: [WalletSharedErrorActionComponent],
  imports: [CommonModule],
  exports: [WalletSharedErrorActionComponent],
})
export class WalletSharedErrorActionModule {
  /* constructor(@Optional() @SkipSelf() parentModule?: WalletSharedErrorActionModule) {}

  static forRoot(config: WalletSharedErrorActionConfigurationInterface): ModuleWithProviders<WalletSharedErrorActionModule> {
    return {
      ngModule: WalletSharedErrorActionModule,
      providers: [WalletSharedErrorActionService, { provide: WalletSharedErrorActionConfiguration, useValue: config }],
    };
  } */
}
