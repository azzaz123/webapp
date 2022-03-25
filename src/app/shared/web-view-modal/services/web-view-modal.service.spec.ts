import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { WebViewModalService } from './web-view-modal.service';

describe('WebViewModalService', () => {
  let service: WebViewModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebViewModalService, { provide: NgbModal, useValue: { open: () => {} } }],
    });
    service = TestBed.inject(WebViewModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
