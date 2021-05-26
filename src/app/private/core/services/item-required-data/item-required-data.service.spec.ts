import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  ITEM,
  ITEM_WITH_REQUIRED_OBJECT_TYPE,
  ITEM_WITH_REQUIRED_OBJECT_TYPE_LEVEL_2,
  ITEM_WITH_REQUIRED_SIZE,
} from '../fixtures/item-required-data.fixtures';
import { ItemRequiredDataService } from './item-required-data.service';

describe('ItemRequiredDataService', () => {
  let service: ItemRequiredDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemRequiredDataService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ItemRequiredDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when checking on required item data', () => {
    describe('that does NOT have special configuration', () => {
      describe('and does have all the required data', () => {
        beforeEach(() => {
          spyOn<any>(service, 'getItem').and.returnValue(of(ITEM));
        });

        it('should return false', (done) => {
          service.hasMissingRequiredDataByItemId('1').subscribe((hasMissingRequiredData: boolean) => {
            expect(hasMissingRequiredData).toBe(false);
            done();
          });
        });
      });

      describe('and does NOT have all the required data', () => {
        beforeEach(() => {
          const ITEM_WITHOUT_ALL_REQUIRED_DATA = ITEM;
          delete ITEM_WITHOUT_ALL_REQUIRED_DATA.content.sale_price;

          spyOn<any>(service, 'getItem').and.returnValue(of(ITEM_WITHOUT_ALL_REQUIRED_DATA));
        });

        it('should return true', (done) => {
          service.hasMissingRequiredDataByItemId('1').subscribe((hasMissingRequiredData: boolean) => {
            expect(hasMissingRequiredData).toBe(true);
            done();
          });
        });
      });
    });

    describe('that needs to check on object_type', () => {
      describe('and does NOT have to check on object_type level 2', () => {
        beforeEach(() => {
          spyOn<any>(service, 'hasToCheckForSecondLevelObjectType').and.returnValue(of(false));
        });

        describe('and does have all the required data', () => {
          beforeEach(() => {
            spyOn<any>(service, 'getItem').and.returnValue(of(ITEM_WITH_REQUIRED_OBJECT_TYPE));
          });

          it('should return false', (done) => {
            service.hasMissingRequiredDataByItemId('1').subscribe((hasMissingRequiredData: boolean) => {
              expect(hasMissingRequiredData).toBe(false);
              done();
            });
          });
        });

        describe('and does NOT have all the required data', () => {
          beforeEach(() => {
            delete ITEM_WITH_REQUIRED_OBJECT_TYPE.content.extra_info.object_type;

            spyOn<any>(service, 'getItem').and.returnValue(of(ITEM_WITH_REQUIRED_OBJECT_TYPE));
          });

          it('should return true', (done) => {
            service.hasMissingRequiredDataByItemId('1').subscribe((hasMissingRequiredData: boolean) => {
              expect(hasMissingRequiredData).toBe(true);
              done();
            });
          });
        });
      });
      describe('and does have to check on object_type level 2', () => {
        beforeEach(() => {
          spyOn<any>(service, 'hasToCheckForSecondLevelObjectType').and.returnValue(of(true));
        });

        describe('and does have all the required data', () => {
          beforeEach(() => {
            spyOn<any>(service, 'getItem').and.returnValue(of(ITEM_WITH_REQUIRED_OBJECT_TYPE_LEVEL_2));
          });

          it('should return false', (done) => {
            service.hasMissingRequiredDataByItemId('1').subscribe((hasMissingRequiredData: boolean) => {
              expect(hasMissingRequiredData).toBe(false);
              done();
            });
          });
        });

        describe('and does NOT have all the required data', () => {
          beforeEach(() => {
            delete ITEM_WITH_REQUIRED_OBJECT_TYPE_LEVEL_2.content.extra_info.object_type.parent_object_type;

            spyOn<any>(service, 'getItem').and.returnValue(of(ITEM_WITH_REQUIRED_OBJECT_TYPE_LEVEL_2));
          });

          it('should return true', (done) => {
            service.hasMissingRequiredDataByItemId('1').subscribe((hasMissingRequiredData: boolean) => {
              expect(hasMissingRequiredData).toBe(true);
              done();
            });
          });
        });
      });
    });

    describe('that needs to check on size', () => {
      beforeEach(() => {
        spyOn<any>(service, 'hasToCheckForSize').and.returnValue(of(true));
      });

      describe('and does have all the required data', () => {
        beforeEach(() => {
          spyOn<any>(service, 'getItem').and.returnValue(of(ITEM_WITH_REQUIRED_SIZE));
        });

        it('should return false', (done) => {
          service.hasMissingRequiredDataByItemId('1').subscribe((hasMissingRequiredData: boolean) => {
            expect(hasMissingRequiredData).toBe(false);
            done();
          });
        });
      });

      describe('and does NOT have all the required data', () => {
        beforeEach(() => {
          delete ITEM_WITH_REQUIRED_SIZE.content.extra_info.size;

          spyOn<any>(service, 'getItem').and.returnValue(of(ITEM_WITH_REQUIRED_SIZE));
        });

        it('should return true', (done) => {
          service.hasMissingRequiredDataByItemId('1').subscribe((hasMissingRequiredData: boolean) => {
            expect(hasMissingRequiredData).toBe(true);
            done();
          });
        });
      });
    });
  });
});
