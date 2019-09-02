import { TestBed } from '@angular/core/testing';

import { RemoteConsoleService } from './remote-console.service';

describe('RemoteConsoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemoteConsoleService = TestBed.get(RemoteConsoleService);
    expect(service).toBeTruthy();
  });
});
