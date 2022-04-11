import { NotificationDto } from '@api/notification/dtos/response/notifcation-dto';

export interface Appboy {
  display: {
    automaticallyShowNewInAppMessages(): void;
    toggleContentCards(): void;
  };

  logContentCardsDisplayed(): void;
  logCardImpressions(cards: NotificationDto[], forContentCards: true): void;
  logCardClick(card: NotificationDto, forContentCards: true): void;

  getCachedContentCards(): AppboyContentCards;
  requestContentCardsRefresh(successCallback?: () => void, errorCallback?: () => void): void;
  subscribeToContentCardsUpdates(subscriber: (cards: AppboyContentCards) => void): string;

  initialize(apiKey: string, config: { manageServiceWorkerExternally: boolean }): void;

  openSession(): void;
  changeUser(id: string): void;

  isPushSupported(): boolean;
  registerAppboyPushMessages(): void;

  toggleAppboyLogging(): void;
  requestImmediateDataFlush(): void;
}

export interface AppboyContentCards {
  cards: NotificationDto[];
  getUnviewedCardCount: () => number;
}
