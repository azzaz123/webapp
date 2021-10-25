import { KYC_REFUSED_REASONS } from '@api/core/model/kyc-properties/constants/kyc-refused-reasons-constants';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCRefusedReason } from '@api/core/model/kyc-properties/interfaces/kyc-refused-reason.interface';
import { KYC_REFUSED_REASON } from '@api/core/model/kyc-properties/kyc-refused-reason.enum';
import {
  MOCK_KYC_PENDING_PROPERTIES_API,
  MOCK_KYC_REJECTED_PROPERTIES_API,
  MOCK_KYC_REJECTED_PROPERTIES_UNKOWN_REFUSED_REASON_API,
} from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import { mapKYCPropertiesApiToKYCProperties } from './kyc-properties.mapper';

describe('when mapping the KYC properties api to KYC properties', () => {
  describe('and the KYC is refused...', () => {
    describe('and the refused reason is defined...', () => {
      it('should return the properties mapped', () => {
        const KYCProperties: KYCProperties = mapKYCPropertiesApiToKYCProperties(MOCK_KYC_REJECTED_PROPERTIES_API);
        const MOCK_REFUSED_REASON: KYCRefusedReason = KYC_REFUSED_REASONS.find(
          (properties: KYCRefusedReason) => properties.reason === MOCK_KYC_REJECTED_PROPERTIES_API.document_refused_reason_type
        );

        expect(KYCProperties).toStrictEqual({
          status: MOCK_KYC_REJECTED_PROPERTIES_API.user_kyc_status,
          refusedReason: MOCK_REFUSED_REASON,
          inflowStatus: MOCK_KYC_REJECTED_PROPERTIES_API.inflow_status,
          outflowStatus: MOCK_KYC_REJECTED_PROPERTIES_API.outflow_status,
        });
      });
    });

    describe('and the refused reason is not defined', () => {
      it('should return the properties mapped with unknown refused reason', () => {
        const KYCProperties: KYCProperties = mapKYCPropertiesApiToKYCProperties(MOCK_KYC_REJECTED_PROPERTIES_UNKOWN_REFUSED_REASON_API);
        const MOCK_UNKNOWN_REFUSED_REASON: KYCRefusedReason = KYC_REFUSED_REASONS.find(
          (properties) => properties.reason === KYC_REFUSED_REASON.UNKNOWN
        );

        expect(KYCProperties).toStrictEqual({
          status: MOCK_KYC_REJECTED_PROPERTIES_UNKOWN_REFUSED_REASON_API.user_kyc_status,
          refusedReason: MOCK_UNKNOWN_REFUSED_REASON,
          inflowStatus: MOCK_KYC_REJECTED_PROPERTIES_UNKOWN_REFUSED_REASON_API.inflow_status,
          outflowStatus: MOCK_KYC_REJECTED_PROPERTIES_UNKOWN_REFUSED_REASON_API.outflow_status,
        });
      });
    });
  });

  describe('and the KYC is not refused', () => {
    it('should return the properties mapped with null refused reason', () => {
      const KYCProperties: KYCProperties = mapKYCPropertiesApiToKYCProperties(MOCK_KYC_PENDING_PROPERTIES_API);

      expect(KYCProperties).toStrictEqual({
        status: MOCK_KYC_REJECTED_PROPERTIES_API.user_kyc_status,
        refusedReason: null,
        inflowStatus: MOCK_KYC_REJECTED_PROPERTIES_API.inflow_status,
        outflowStatus: MOCK_KYC_REJECTED_PROPERTIES_API.outflow_status,
      });
    });
  });
});
