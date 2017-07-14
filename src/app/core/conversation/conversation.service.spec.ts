import { inject, TestBed } from '@angular/core/testing';
import { ConversationService } from 'shield';
import { RouterTestingModule } from '@angular/router/testing';


describe('ConversationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {provide: ConversationService, useValue: {}}]
    });
  });

  it('should be created', inject([ConversationService], (service: ConversationService) => {
    expect(service).toBeTruthy();
  }));
});
