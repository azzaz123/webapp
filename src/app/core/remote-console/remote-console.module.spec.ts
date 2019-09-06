import { RemoteConsoleModule } from './remote-console.module';

describe('RemoteConsoleModule', () => {
  let remoteConsoleModule: RemoteConsoleModule;

  beforeEach(() => {
    remoteConsoleModule = new RemoteConsoleModule();
  });

  it('should create an instance', () => {
    expect(remoteConsoleModule).toBeTruthy();
  });
});
