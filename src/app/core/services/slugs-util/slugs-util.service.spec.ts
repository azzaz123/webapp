import { TestBed } from '@angular/core/testing';
import { SlugsUtilService } from './slugs-util.service';

describe('SlugsUtilService', () => {
  let service: SlugsUtilService;
  const userName = 'user-generic-';
  const UUID = '83ghdus823';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlugsUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the UUID from the web slug...', () => {
    describe('if the UUID is defined...', () => {
      it('should return the UUID', () => {
        const webSlug = userName + UUID;

        expect(service.getUUIDfromSlug(webSlug)).toBe(UUID);
      });
    });
    describe('if the UUID is NOT defined...', () => {
      it('should return the web slug', () => {
        expect(service.getUUIDfromSlug(userName)).toBe(userName);
      });
    });
  });
});
