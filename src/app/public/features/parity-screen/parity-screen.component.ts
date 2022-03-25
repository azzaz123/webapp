import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { QR_CODE_SIZE } from '@public/features/parity-screen/parity-screen.enum';

@Component({
  selector: 'tsl-parity',
  templateUrl: './parity-screen.component.html',
  styleUrls: ['./parity-screen.component.scss'],
})
export class ParityScreenComponent implements AfterViewInit {
  @ViewChild('qrCode', { static: false }) qrCode: any;

  public qrSize: QR_CODE_SIZE;
  public qrData: string;
  private imgURL: string = 'assets/images/generic-landing/wallapop-logo-black-round.svg';
  private mutationObserverExists: boolean;

  constructor(private publicFooterService: PublicFooterService, private deviceService: DeviceService) {
    this.publicFooterService.setShow(false);
    this.mutationObserverExists = !!window.MutationObserver;
    this.qrSize = this.setQrSize(this.deviceService.isMobile());
    this.qrData = 'https://www.wallapop.com/';
  }

  public ngAfterViewInit(): void {
    this.observeQrCode();
  }

  private observeQrCode(): void {
    if (this.mutationObserverExists) {
      const mutationObserver = new MutationObserver(this.injectLogo.bind(this));

      mutationObserver.observe(this.qrCode.qrcElement.nativeElement, { childList: true, subtree: true });
    }
  }

  private injectLogo(mutations: MutationRecord[]): void {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.type === 'childList') {
        const target = mutation.addedNodes[0] as HTMLCanvasElement;
        if (target.nodeName === 'CANVAS') {
          const context = target.getContext('2d');
          const image = new Image();
          image.src = this.imgURL;
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
