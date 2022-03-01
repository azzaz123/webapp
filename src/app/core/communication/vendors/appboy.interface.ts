import { NotificationDto } from '@api/notification/dtos/response/notifcation-dto';

export interface Appboy {
  display: {
    automaticallyShowNewInAppMessages(): void;
    toggleContentCards(): void;
  };

  logContentCardsDisplayed(): void;
  getCachedContentCards(): {
    cards: NotificationDto[];
  };

  initialize(apiKey: string, config: { manageServiceWorkerExternally: boolean }): void;

  openSession(): void;
  changeUser(id: string): void;

  isPushSupported(): boolean;
  registerAppboyPushMessages(): void;

  toggleAppboyLogging(): void;
}
