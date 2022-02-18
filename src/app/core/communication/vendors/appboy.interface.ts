export interface Appboy {
  display: {
    automaticallyShowNewInAppMessages(): void;
    toggleContentCards(): void;
  };

  initialize(apiKey: string, config: { enableHtmlInAppMessages: boolean; manageServiceWorkerExternally: boolean }): void;

  openSession(): void;
  changeUser(id: string): void;

  isPushSupported(): boolean;
  registerAppboyPushMessages(): void;

  toggleAppboyLogging(): void;
}
