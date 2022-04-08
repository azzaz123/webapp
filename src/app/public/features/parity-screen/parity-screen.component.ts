import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { QR_CODE_SIZE } from '@public/features/parity-screen/parity-screen.enum';
import { ADJUST_GENERIC_STORE_APP_URL } from '@core/constants';
import { QrIconInjectorService } from '@shared/qr-icon-injector/qr-icon-injector.service';

@Component({
  selector: 'tsl-parity',
  templateUrl: './parity-screen.component.html',
  styleUrls: ['./parity-screen.component.scss'],
})
export class ParityScreenComponent implements AfterViewInit {
  @ViewChild('qrCode', { static: false }) qrCode: any;

  public qrSize: QR_CODE_SIZE;
  public url: string = ADJUST_GENERIC_STORE_APP_URL;
  public device: DeviceType;
  public DevicesType: typeof DeviceType = DeviceType;
  private wallapopIconRound: string = 'assets/images/generic-landing/wallapop-logo-black-round.svg';

  constructor(
    private publicFooterService: PublicFooterService,
    private deviceService: DeviceService,
    private qrIconInjectorService: QrIconInjectorService
  ) {
    this.publicFooterService.setShow(false);
    this.device = this.deviceService.getDeviceType();
    this.qrSize = this.setQrSize(this.deviceService.isMobile());
  }

  public ngAfterViewInit(): void {
    if (this.deviceService.isDesktop() || this.deviceService.isTablet()) {
      this.qrIconInjectorService.injectLogo(this.qrCode.qrcElement.nativeElement, { width: 38, height: 38 }, this.wallapopIconRound);
    }
  }

  private setQrSize(isMobile: boolean): QR_CODE_SIZE {
    return isMobile ? QR_CODE_SIZE.SMALL : QR_CODE_SIZE.BIG;
  }
}
