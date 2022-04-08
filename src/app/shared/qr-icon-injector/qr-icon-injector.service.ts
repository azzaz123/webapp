import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@core/window/window.token';

@Injectable({
  providedIn: 'root',
})
export class QrIconInjectorService {
  private mutationObserverCompatibility: boolean;
  private mutationObserverInstance: MutationObserver;

  constructor(@Inject(WINDOW_TOKEN) private window) {}

  public injectLogo(qrElement: Node, iconSize: { width: number; height: number }, iconPath: string): void {
    this.mutationObserverCompatibility = !!this.window.MutationObserver;

    if (this.mutationObserverCompatibility && !this.mutationObserverInstance) {
      this.mutationObserverInstance = new MutationObserver(this.editQrCanvas.bind(this, iconSize, iconPath));
      this.mutationObserverInstance.observe(qrElement, { childList: true, subtree: true });
    }
  }

  private editQrCanvas(iconSize: { width: number; height: number }, iconPath: string, mutations: MutationRecord[]): void {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.type === 'childList') {
        const target = mutation.addedNodes[0] as HTMLCanvasElement;
        if (target.nodeName === 'CANVAS') {
          const context = target.getContext('2d');
          const image = new Image();
          image.src = iconPath;
          const iWidth = iconSize.width;
          const iHeight = iconSize.height;
          target.style.verticalAlign = 'bottom';
          image.onload = () => {
            context.drawImage(image, target.width / 2 - iWidth / 2, target.height / 2 - iHeight / 2, iWidth, iHeight);
          };
        }
      }
    });
  }
}
