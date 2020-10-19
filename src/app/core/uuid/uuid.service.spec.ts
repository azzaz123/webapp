import { TestBed } from '@angular/core/testing';
import { UuidService } from './uuid.service';
import * as UUID from 'uuid';

jest.mock('uuid', () => {
  return { v4: () => null }
});

describe('UuidService', () => {
  let service: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UuidService);
  });

  it('should return uuid', () => {
    spyOn(UUID, 'v4').and.returnValue('1-2-3');

    expect(service.getUUID()).toEqual('1-2-3');
  });

  it('should return uuid singleton', () => {
    spyOn(UUID, 'v4').and.returnValue('1-2-3');

    expect(UuidService.getUUID()).toEqual('1-2-3');
  });
});
