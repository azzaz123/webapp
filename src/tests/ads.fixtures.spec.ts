import { Observable, Subscriber } from 'rxjs';

export class MockAdsService {
  public init(): void {}

  public adsRefresh(): void {}

  public displayAdBySlotId(AdSlotId): void {}
}
export class MockAmazonPublisherService {
  public isLibraryRefDefined() {
    return true;
  }

  public init() {}

  public requestBid() {
    return new Observable((observer: Subscriber<void>) => {
      observer.complete();
    });
  }
}

export class MockCriteoService {
  public isLibraryRefDefined() {
    return true;
  }

  public requestBid() {
    return new Observable((observer: Subscriber<void>) => {
      observer.complete();
    });
  }
}

export class MockGooglePublisherTagService {
  public isLibraryRefDefined() {
    return true;
  }

  public init() {}
}
