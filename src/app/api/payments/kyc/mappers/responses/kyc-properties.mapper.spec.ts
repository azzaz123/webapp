import { KYC_REFUSED_REASONS } from '@api/core/model/kyc-properties/constants/kyc-refused-reasons-constants';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCRefusedReason } from '@api/core/model/kyc-properties/interfaces/kyc-refused-reason.interface';
import { MOCK_KYC_REJECTED_PROPERTIES_API } from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import { mapKYCPropertiesApiToKYCProperties } from './kyc-properties.mapper';

describe('when mapping the KYC properties api to KYC properties', () => {
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