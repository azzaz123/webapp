import { Component, ElementRef, Input, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { SvgService } from '../svg.service';

@Component({
  selector: 'tsl-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent implements OnInit {
  @ViewChild('innerSvg') element: ElementRef;
  @Input() src: string;

  constructor(
    private svgService: SvgService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getIcon();
  }

  private getIcon(): void {
    if (this.handleExtension()) {
      this.svgService.getIconByPath(this.src)
        .pipe(take(1))
        .subscribe((svg: string) => {
          const svgElement = this.sanitizer.bypassSecurityTrustHtml(svg);
          this.element.nativeElement.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, svgElement);
        });
    }
  }

  private handleExtension(): boolean {
    return (/\.(svg)$/i).test(this.src);
  }
}
