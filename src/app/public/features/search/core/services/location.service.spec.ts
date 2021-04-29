import { TestBed } from '@angular/core/testing';

import { LocationService } from './location.service';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationService],
    });
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked for correct location', () => {
    describe('and querystring location present', () => {
      it('should keep querystring location', () => {});
    });

    describe('and no querystring location present', () => {
      describe('and cookie location present', () => {
        it('should keep cookie location', () => {});
      });

      describe('and no cookie location present', () => {
        describe('and localStorage location present', () => {
          it('should keep localStorage location', () => {});
        });

        describe('and no localStorage location present', () => {
          it('should keep default location', () => {});
        });
      });
    });
  });

  describe('when setting new location', () => {
    it('should save it in locationStorage', () => {});
  });
});
