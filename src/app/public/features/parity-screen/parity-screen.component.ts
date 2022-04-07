import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { QR_CODE_SIZE } from '@public/features/parity-screen/parity-screen.enum';
import { ADJUST_GENERIC_STORE_APP_URL } from '@core/constants';

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
  private mutationObserverCompatibility: boolean;
  private mutationObserverInstance: MutationObserver;

  constructor(
    private publicFooterService: PublicFooterService,
    private deviceService: DeviceService,
    @Inject(WINDOW_TOKEN) private window
  ) {
    this.publicFooterService.setShow(false);
    this.mutationObserverCompatibility = !!this.window.MutationObserver;
    this.device = this.deviceService.getDeviceType();
    this.qrSize = this.setQrSize(this.deviceService.isMobile());
  }

  public ngAfterViewInit(): void {
    if (this.deviceService.isDesktop() || this.deviceService.isTablet()) {
      this.observeQrCode();
    }
  }

  private observeQrCode(): void {
    if (this.mutationObserverCompatibility && !this.mutationObserverInstance) {
      this.mutationObserverInstance = new MutationObserver(this.injectLogo.bind(this));

      this.mutationObserverInstance.observe(this.qrCode.qrcElement.nativeElement, { childList: true, subtree: true });
    }
  }

  private injectLogo(mutations: MutationRecord[]): void {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.type === 'childList') {
        const target = mutation.addedNodes[0] as HTMLCanvasElement;
        if (target.nodeName === 'CANVAS') {
          const context = target.getContext('2d');
          const image = new Image();
          image.src = this.wallapopIconRound;
          const iWidth = 38;
          const iHeight = 38;
          target.style.verticalAlign = 'bottom';
          image.onload = () => {
            context.drawImage(image, target.width / 2 - iWidth / 2, target.height / 2 - iHeight / 2, iWidth, iHeight);
          };
        }
      }
    });
  }

  private setQrSize(isMobile: boolean): QR_CODE_SIZE {
    return isMobile ? QR_CODE_SIZE.SMALL : QR_CODE_SIZE.BIG;
  }
}
