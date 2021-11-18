import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@core/user/user.service';
import { AdsTargetingsService } from './ads-targetings.service';
import { MockUser, MockUserService } from '@fixtures/user.fixtures.spec';
import { SearchBoxValue } from '@layout/topbar/core/interfaces/suggester-response.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { BehaviorSubject } from 'rxjs';

const MOCK_SEARCH_KEYWORD: SearchBoxValue = { [FILTER_QUERY_PARAM_KEY.keywords]: 'iphone' };

const searchParamsMockSubject = new BehaviorSubject(MOCK_SEARCH_KEYWORD);
const searchParamsMock = searchParamsMockSubject.asObservable();

describe('AdsTargetingsService', () => {
  let service: AdsTargetingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UserService,
          useValue: MockUserService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: searchParamsMock,
          },
        },
      ],
    });
    service = TestBed.inject(AdsTargetingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
