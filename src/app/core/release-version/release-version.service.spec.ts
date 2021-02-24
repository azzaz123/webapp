import { TestBed } from '@angular/core/testing';
import { ReleaseVersionService } from './release-version.service';

describe('ReleaseVersionService', () => {
  let service: ReleaseVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReleaseVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReleaseVersion', () => {
    it('should return release version', () => {
      expect(service.getReleaseVersion('1')).toEqual('1');
      expect(service.getReleaseVersion('1.9')).toEqual('1009');
      expect(service.getReleaseVersion('1.2.5')).toEqual('1002005');
      expect(service.getReleaseVersion('1.20.5')).toEqual('1020005');
      expect(service.getReleaseVersion('1.320.512')).toEqual('1320512');
      expect(service.getReleaseVersion('23.320.512')).toEqual('23320512');
      expect(service.getReleaseVersion('157.320.512')).toEqual('157320512');
    });
  });
});
