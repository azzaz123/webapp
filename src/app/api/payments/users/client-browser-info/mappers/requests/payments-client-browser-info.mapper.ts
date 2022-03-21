import { PaymentsClientBrowserInfo } from '@api/core/model/payments';
import { ToApiMapper } from '@api/core/utils/types';
import { PaymentsClientBrowserInfoDto } from '../../dtos/requests';

export const mapPaymentsClientBrowserInfoToDto: ToApiMapper<PaymentsClientBrowserInfo, PaymentsClientBrowserInfoDto> = (
  input: PaymentsClientBrowserInfo
): PaymentsClientBrowserInfoDto => {
  const {
    isJavaEnabled: java_enabled,
    isJavaScriptEnabled: javascript_enabled,
    language,
    colorDepth,
    screenHeight,
    screenWidth,
    timeZoneOffset: time_zone_offset,
    userAgent: user_agent,
  } = input;
  return {
    java_enabled,
    javascript_enabled,
    language,
    color_depth: colorDepth.toString(),
    screen_height: screenHeight.toString(),
    screen_width: screenWidth.toString(),
    time_zone_offset,
    user_agent,
  };
};
