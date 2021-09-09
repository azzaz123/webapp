import { KYC_REFUSED_REASONS } from '@api/core/model/kyc-properties/constants/kyc-refused-reasons-constants';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCRefusedReason } from '@api/core/model/kyc-properties/interfaces/kyc-refused-reason.interface';
import { KYCPropertiesApi } from '@api/payments/kyc-properties/dtos/responses';
import { MOCK_KYC_REJECTED_PROPERTIES_API } from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import { mapKYCPropertiesApiToKYCProperties } from './kyc-properties.mapper';

describe('when mapping the KYC properties api to KYC properties', () => {
  it('should return the properties mapped', () => {
    const KYCProperties: KYCProperties = mapKYCPropertiesApiToKYCProperties(MOCK_KYC_REJECTED_PROPERTIES_API);

    expect(KYCProperties).toStrictEqual({
      status: MOCK_KYC_REJECTED_PROPERTIES_API.user_kyc_status,
      refusedReason: MOCK_REFUSED_REASON(MOCK_KYC_REJECTED_PROPERTIES_API),
      inflowStatus: MOCK_KYC_REJECTED_PROPERTIES_API.inflow_status,
      outflowStatus: MOCK_KYC_REJECTED_PROPERTIES_API.outflow_status,
    });

    function MOCK_REFUSED_REASON(KYCPropertiesApi: KYCPropertiesApi): KYCRefusedReason {
      return KYC_REFUSED_REASONS.find((properties) => properties.reason === KYCPropertiesApi.document_refused_reason_type);
    }
  });
});
