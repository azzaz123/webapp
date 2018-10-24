import { TestBed, inject } from '@angular/core/testing';

import { GeneralSuggestionsService } from './general-suggestions.service';

describe('GeneralSuggestionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralSuggestionsService]
    });
  });

  it('should be created', inject([GeneralSuggestionsService], (service: GeneralSuggestionsService) => {
    expect(service).toBeTruthy();
  }));
});
