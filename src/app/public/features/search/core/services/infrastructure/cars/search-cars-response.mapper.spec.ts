import { translations } from '@core/i18n/translations/constants/translations';
import { SEARCH_ITEM_CAR_RESPONSE_CONTENT_MOCK } from '@fixtures/search-item-car-response-content.fixtures.spec';
import { HORSEPOWER_UNIT, MILEAGE_UNIT, ItemCarSpecsMapper } from "./search-cars-response.mapper";

describe('SearchItemCarResponseMapper', () => {
    const result = ItemCarSpecsMapper(SEARCH_ITEM_CAR_RESPONSE_CONTENT_MOCK);

    describe('when the car has an engine specified', () => {
        it('should include the translation for the type of engine', () => {
            const engine = SEARCH_ITEM_CAR_RESPONSE_CONTENT_MOCK.engine.toLowerCase();
            const expectedTranslation = translations[engine];

            expect(result.includes(expectedTranslation)).toBe(true);
        });
    });

    describe('when the car has a gearbox specified', () => {
        it('should include the translation for the type of engine', () => {
            const gearbox = SEARCH_ITEM_CAR_RESPONSE_CONTENT_MOCK.gearbox;
            const expectedTranslation = translations[gearbox];

            expect(result.includes(expectedTranslation)).toBe(true);
        });
    });

    describe('when the car has a horsepower specified', () => {
        it('should include the horsepower value including the measurament unit', () => {
            const horsepower = SEARCH_ITEM_CAR_RESPONSE_CONTENT_MOCK.horsepower;
            const expectedValue = `${horsepower} ${HORSEPOWER_UNIT}`;

            expect(result.includes(expectedValue)).toBe(true);
        });
    });

    describe('when the car has a year specified', () => {
        it('should include the horsepower value including the measurament unit', () => {
            const expectedValue = `${SEARCH_ITEM_CAR_RESPONSE_CONTENT_MOCK.year}`;

            expect(result.includes(expectedValue)).toBe(true);
        });
    });

    describe('when the car has a mileage specified', () => {
        it('should include the mileage value including the measurament unit', () => {
            const mileage = SEARCH_ITEM_CAR_RESPONSE_CONTENT_MOCK.km;
            const expectedValue = `${mileage} ${MILEAGE_UNIT}`;

            expect(result.includes(expectedValue)).toBe(true);
        });
    });
});