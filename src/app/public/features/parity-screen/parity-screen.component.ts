import { Component } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { ADJUST_GENERIC_STORE_APP_URL } from '@core/constants';

@Component({
  selector: 'tsl-parity',
  templateUrl: './parity-screen.component.html',
  styleUrls: ['./parity-screen.component.scss'],
})
export class ParityScreenComponent {
  public readonly QR_SIZE = 180;
  public readonly url: string = ADJUST_GENERIC_STORE_APP_URL;
  public readonly DeviceTypes = DeviceType;
  public device: DeviceType;

  constructor(private publicFooterService: PublicFooterService, private deviceService: DeviceService) {
    this.publicFooterService.setShow(false);
    this.device = this.deviceService.getDeviceType();
  }
}
