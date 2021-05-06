import { TestBed } from '@angular/core/testing';

import { HostVisibilityService } from './host-visibility.service';

describe('HostVisibilityService', () => {
  let service: HostVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when host attaches', () => {
    it('should notify about the visibility', () => {});
  });

  describe('when values change', () => {
    describe('... in the drawer store', () => {
      it('should ONLY notify listeners whose visibility change', () => {});
    });

    describe('... in the bubble store', () => {
      it('should ONLY notify listeners whose visibility change', () => {});
    });
  });

  describe('when host detaches', () => {
    it('should not notify listener', () => {});
  });

  describe('when adding new visibility conditions', () => {
    describe('and the condition is for a new parameter', () => {
      it('should add condition to the list', () => {});
    });

    describe('and the condition is for an existing parameter', () => {
      describe('with new required parameters', () => {
        it('should merge required parameters', () => {});
      });

      describe('with existing required parameters', () => {
        it('should leave existing parameters', () => {});
      });

      describe('with new excluding parameters', () => {
        it('should add excluding parameters to the list', () => {});
      });

      describe('with existing excluding parameters', () => {
        describe('with new values', () => {
          it('should merge the values', () => {});
        });

        describe('with existing values', () => {
          it('should keep the original values');
        });
      });
    });

    describe('and host visibility changes', () => {
      it('should ONLY notify listeners whose visibility change', () => {});
    });
  });
});
