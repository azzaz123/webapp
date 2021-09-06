import { KYC_REFUSED_REASON_PROPERTIES } from '@api/core/model/kyc-properties/constants/kyc-refused-reasons-constants';
import { KYCProperties } from '@api/core/model/kyc-properties/interfaces/kyc-properties.interface';
import { KYCRefusedReasonProperty } from '@api/core/model/kyc-properties/interfaces/kyc-refused-reason-property.interface';
import { KYCPropertiesApi } from '@api/payments/kyc-properties/dtos/responses';
import { MOCK_KYC_REJECTED_PROPERTIES_API } from '@fixtures/private/wallet/kyc/kyc-properties.fixtures.spec';
import { mapKYCPropertiesApiToKYCProperties } from './kyc-properties.mapper';

describe('when mapping the KYC properties api to KYC properties', () => {
  it('should return the properties mapped', () => {
    const KYCProperties: KYCProperties = mapKYCPropertiesApiToKYCProperties(MOCK_KYC_REJECTED_PROPERTIES_API);

    expect(KYCProperties).toStrictEqual({
      status: MOCK_KYC_REJECTED_PROPERTIES_API.document_status,
      refusedReason: MOCK_REFUSED_REASON(MOCK_KYC_REJECTED_PROPERTIES_API),
      documentId: MOCK_KYC_REJECTED_PROPERTIES_API.document_id,
      mangopayUserId: MOCK_KYC_REJECTED_PROPERTIES_API.mangopay_user_kyc_id,
    });

    function MOCK_REFUSED_REASON(KYCPropertiesApi: KYCPropertiesApi): KYCRefusedReasonProperty {
      return KYC_REFUSED_REASON_PROPERTIES.find((properties) => properties.reason === KYCPropertiesApi.document_refused_reason_type);
    }
  });
});
