import { KYC_DOCUMENTATION_TYPE } from '../../enums/kyc-documentation-type-enum';
import { KYC_NATIONALITY_TYPE } from '../../enums/kyc-nationality-type-enum';
import { getKYCAvailableDocuments } from './kyc-documents.mapper';

describe('getKYCAvailableDocuments', () => {
  describe('when user selects the european nationality...', () => {
    const availableEuropeanDocuments = getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.EUROPEAN_UNION);

    it('should return id as available document', () => {
      expect(availableEuropeanDocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.ID)).toBeDefined();
    });
    it('should return driving license as available document', () => {
      expect(availableEuropeanDocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.DRIVING_LICENSE)).toBeDefined();
    });
    it('should return passport as available document', () => {
      expect(availableEuropeanDocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.PASSPORT)).toBeDefined();
    });
    it('should return residence permit as available document', () => {
      expect(availableEuropeanDocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.RESIDENCE_PERMIT)).toBeDefined();
    });
  });

  describe('when user selects the canadian, uk or usa nationality...', () => {
    const availableUKUSACADocuments = getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.UK_USA_CANADA);

    it('should NOT return id as available document', () => {
      expect(availableUKUSACADocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.ID)).toBeUndefined();
    });
    it('should NOT return residence permit as available document', () => {
      expect(availableUKUSACADocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.RESIDENCE_PERMIT)).toBeUndefined();
    });
    it('should return driving license as available document', () => {
      expect(availableUKUSACADocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.DRIVING_LICENSE)).toBeDefined();
    });
    it('should return passport as available document', () => {
      expect(availableUKUSACADocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.PASSPORT)).toBeDefined();
    });
  });

  describe('when user selects other nationality...', () => {
    const availableOtherNationalityDocuments = getKYCAvailableDocuments(KYC_NATIONALITY_TYPE.OTHER);

    it('should NOT return id as available document', () => {
      expect(availableOtherNationalityDocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.ID)).toBeUndefined();
    });
    it('should NOT return driving license as available document', () => {
      expect(
        availableOtherNationalityDocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.DRIVING_LICENSE)
      ).toBeUndefined();
    });
    it('should NOT return residence permit as available document', () => {
      expect(
        availableOtherNationalityDocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.RESIDENCE_PERMIT)
      ).toBeUndefined();
    });
    it('should return passport as available document', () => {
      expect(availableOtherNationalityDocuments.find((document) => document.value === KYC_DOCUMENTATION_TYPE.PASSPORT)).toBeDefined();
    });
  });
});
