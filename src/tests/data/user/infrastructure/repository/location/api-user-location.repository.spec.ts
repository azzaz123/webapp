import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { UserLocation } from '@data/user';
import { CoordinateMother } from '@fixtures/core';
import { UserLocationMother } from '@fixtures/data/user/domain';
import { ApiUserLocationRepository } from 'app/data/user/infrastructure/repository/location/api-user-location.repository';
describe('ApiUserLocationRepository', () => {
  let repository: ApiUserLocationRepository;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiUserLocationRepository]
    })

    httpTestingController = TestBed.inject(HttpTestingController);
    repository = TestBed.inject(ApiUserLocationRepository)
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('updateByCoordinates', () => {
    it('should update coordinates and return a location', () => {
      const location: UserLocation = UserLocationMother.random();
      const coordinates: Coordinate = CoordinateMother.random();

      repository.updateByCoordinates(coordinates).subscribe((response: UserLocation) => {
        expect(response).toEqual(location);
      })

      const req = httpTestingController.expectOne(ApiUserLocationRepository.USER_LOCATION_URL);
      expect(req.request.method).toBe('PUT');
      req.flush(location)

    });
  });

});
