import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tsl-parity',
  templateUrl: './parity-screen.component.html',
  styleUrls: ['./parity-screen.component.scss'],
})
export class ParityScreenComponent implements AfterViewInit {
  @ViewChild('qrCode', { static: false }) qrCode: any;

  private imgURL: string = 'assets/images/generic-landing/wallapop-logo-black-round.svg';
  private mutationObserverExists: boolean;

  constructor(private publicFooterService: PublicFooterService) {
    this.publicFooterService.setShow(false);
    this.mutationObserverExists = !!window.MutationObserver;
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
          const iWidth = 60;
          const iHeight = 60;
          image.onload = () => {
            context.drawImage(image, target.width / 2 - iWidth / 2, target.height / 2 - iHeight / 2, iWidth, iHeight);
          };
        }
      }
    });
  }
}
