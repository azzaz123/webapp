import { SEARCH_ITEM_REAL_ESTATE_RESPONSE_CONTENT_MOCK } from '@fixtures/search-item-real-estate-response-content.fixtures.spec';
import { SearchItemRealEstateSpecsMapper, SURFACE_UNIT } from './search-real-estate-response.mapper';

describe('searchItemRealEstateResponseMapper', () => {
    describe('when the property has just 1 room', () => {
        it('should include the value with translation in singular', () => {
            const MOCK_WITH_ONE_ROOM = { ...SEARCH_ITEM_REAL_ESTATE_RESPONSE_CONTENT_MOCK, rooms: 1 };
            const result = SearchItemRealEstateSpecsMapper(MOCK_WITH_ONE_ROOM);
            const expectedTranslation = `${MOCK_WITH_ONE_ROOM.rooms} Room`;

            expect(result.includes(expectedTranslation)).toBe(true);
        });
    });

    describe('when the property has more than 1 room', () => {
        it('should include the value with translation in plural', () => {
            const result = SearchItemRealEstateSpecsMapper(SEARCH_ITEM_REAL_ESTATE_RESPONSE_CONTENT_MOCK);
            const expectedTranslation = `${SEARCH_ITEM_REAL_ESTATE_RESPONSE_CONTENT_MOCK.rooms} Rooms`;

            expect(result.includes(expectedTranslation)).toBe(true);
        });
    });

    describe('when the property has just 1 bathroom', () => {
        it('should include the value with translation in singular', () => {
            const MOCK_WITH_ONE_BATHROOM = { ...SEARCH_ITEM_REAL_ESTATE_RESPONSE_CONTENT_MOCK, bathrooms: 1 };
            const result = SearchItemRealEstateSpecsMapper(MOCK_WITH_ONE_BATHROOM);
            const expectedTranslation = `${MOCK_WITH_ONE_BATHROOM.bathrooms} Bathroom`;

            expect(result.includes(expectedTranslation)).toBe(true);
        });
    });

    describe('when the property has more than 1 bathroom', () => {
        it('should include the value with translation in plural', () => {
            const result = SearchItemRealEstateSpecsMapper(SEARCH_ITEM_REAL_ESTATE_RESPONSE_CONTENT_MOCK);
            const expectedTranslation = `${SEARCH_ITEM_REAL_ESTATE_RESPONSE_CONTENT_MOCK.bathrooms} Bathrooms`;

            expect(result.includes(expectedTranslation)).toBe(true);
        });
    });

    describe('when the property has the surface specified', () => {
        it('should include the value including the measurament unit', () => {
            const result = SearchItemRealEstateSpecsMapper(SEARCH_ITEM_REAL_ESTATE_RESPONSE_CONTENT_MOCK);
            const expectedValue = `${SEARCH_ITEM_REAL_ESTATE_RESPONSE_CONTENT_MOCK.surface} ${SURFACE_UNIT}`;

            expect(result.includes(expectedValue)).toBe(true);
        });
    });
});