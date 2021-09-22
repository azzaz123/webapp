import { TestBed } from '@angular/core/testing';

import { ChatTranslationService } from './chat-translation.service';

describe('ChatTranslationService', () => {
  let service: ChatTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
