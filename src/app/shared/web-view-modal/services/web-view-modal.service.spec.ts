import { TestBed } from '@angular/core/testing';

import { WebViewModalService } from './web-view-modal.service';

describe('WebViewModalService', () => {
  let service: WebViewModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebViewModalService],
    });
    service = TestBed.inject(WebViewModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
