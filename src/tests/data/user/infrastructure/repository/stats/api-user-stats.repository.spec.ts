import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserId, UserStats } from '@data/user';
import { UserIdMother } from '@fixtures/data/user/domain';
import { ApiUserStatsRepository } from 'app/data/user/infrastructure/repository/stats/api-user-stats.repository';
import { ApiUserStasMapper, ApiUserStatsResponse } from 'app/data/user/infrastructure/repository/stats/api-user-stats.response';
import { ApiUserStatsResponseMother } from './api-user-stats.response.mother';


describe('ApiUserStatsRepository', () => {
  let repository: ApiUserStatsRepository;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiUserStatsRepository]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    repository = TestBed.inject(ApiUserStatsRepository);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('getStats', () => {

    it('should return a userStats', () => {
      const apiUserStatsResponse: ApiUserStatsResponse = ApiUserStatsResponseMother.random();
      const stats: UserStats = ApiUserStasMapper.toDomain(apiUserStatsResponse);

      repository.getStats().subscribe((response: UserStats) => {
        expect(response).toEqual(stats);
      });

      const req = httpTestingController.expectOne(ApiUserStatsRepository.USER_STATS_URL);
      expect(req.request.method).toBe('GET');
      req.flush(apiUserStatsResponse);
    });

  });

  describe('getByUserId', () => {
    it('should return a userStats by userId', () => {
      const apiUserStatsResponse: ApiUserStatsResponse = ApiUserStatsResponseMother.random();
      const stats: UserStats = ApiUserStasMapper.toDomain(apiUserStatsResponse);
      const userId: UserId = UserIdMother.random()

      repository.getByUserId(userId).subscribe((response: UserStats) => {
        expect(response).toEqual(stats);
      });

      const req = httpTestingController.expectOne(`${ApiUserStatsRepository.USER_STATS_URL}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(apiUserStatsResponse);
    });
  });

});
