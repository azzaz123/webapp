import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { SvgService } from '../svg.service';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
export class SvgIconComponent implements OnInit {
  @Input() src: string;
  @Input() width: string;
  @Input() height: string;
  @Input() fill: string;

  constructor(
    private svgService: SvgService,
    private sanitizer: DomSanitizer,
    private element: ElementRef
  ) {}

  ngOnInit(): void {
    this.getIcon();
  }

  private getIcon(): void {
    if (this.hasSvgExtension) {
      this.svgService
        .getIconByPath(this.src)
        .pipe(take(1))
        .subscribe((svg: string) => {
          const svgElement = this.sanitizer.bypassSecurityTrustHtml(svg);
          this.element.nativeElement.innerHTML = this.sanitizer.sanitize(
            SecurityContext.HTML,
            svgElement
          );

          this.handleCustomAttributes();
        });
    }
  }

  private handleCustomAttributes(): void {
    let style = '';
    style += this.width ? `width: ${this.width}px;` : '';
    style += this.height ? `height: ${this.height}px;` : '';
    style += this.fill ? `fill: ${this.fill};` : '';

    if (style !== '') {
      this.element.nativeElement?.firstElementChild?.setAttribute(
        'style',
        style
      );
    }
  }

  get hasSvgExtension(): boolean {
    return /\.(svg)$/i.test(this.src);
  }
}
