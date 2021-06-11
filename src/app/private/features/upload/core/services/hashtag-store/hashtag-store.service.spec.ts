import { TestBed } from '@angular/core/testing';
import { MOCK_HASHTAGS } from '@fixtures/hashtag-suggester.fixtures.spec';
import { HashtagStoreService } from './hashtag-store.service';

describe('HashtagStoreService', () => {
  let service: HashtagStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HashtagStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we add hashTag', () => {
    it('should offer us the selected hashtags with the new added hashtag', () => {
      service.addHashtag(MOCK_HASHTAGS[0]);

      expect(service.selectedHashtags).toEqual([MOCK_HASHTAGS[0]]);
    });
  });

  describe('when we delete hashTag', () => {
    it('should offer us the selected hashtags without the hashtag we want to delete', () => {
      service.deleteHashtag(MOCK_HASHTAGS[0]);

      expect(service.selectedHashtags).toEqual([]);
    });
  });
});
