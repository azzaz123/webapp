export class MockCookieService {
  get(_key: string): string {
    return '';
  }

  put(_key: string): void {}

  delete(_key: string): void {}
}
