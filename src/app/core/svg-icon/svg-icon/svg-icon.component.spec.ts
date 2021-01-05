import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  SecurityContext,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SvgService } from '../svg.service';
import { SvgIconComponent } from './svg-icon.component';

describe('SvgIconComponent', () => {
  const svgTag: string = '<svg></svg>';
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;
  let svgService: SvgService;
  let domSanitizer: DomSanitizer;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SvgIconComponent],
        providers: [
          {
            provide: ElementRef,
            useValue: {
              nativeElement: {},
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgIconComponent);

    component = fixture.componentInstance;
    svgService = TestBed.inject(SvgService);
    domSanitizer = TestBed.inject(DomSanitizer);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit() - initializing the component', () => {
    describe('if the src is a svg', () => {
      beforeEach(() => {
        spyOn(svgService, 'getIconByPath').and.returnValue(of(svgTag));
        component.src = 'mySvg.svg';
        fixture.detectChanges();
        component.ngOnInit();
      });

      it('should display the icon in the HTML', () => {
        const secureSvg: SafeHtml = domSanitizer.bypassSecurityTrustHtml(
          svgTag
        );
        const sanitizedSvg: string = domSanitizer.sanitize(
          SecurityContext.HTML,
          secureSvg
        );
        const innerHTML: HTMLElement =
          fixture.elementRef.nativeElement.innerHTML;
        spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.callThrough();
        spyOn(domSanitizer, 'sanitize');

        component.ngOnInit();

        expect(svgService.getIconByPath).toHaveBeenCalledWith(component.src);
        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          svgTag
        );
        expect(domSanitizer.sanitize).toHaveBeenCalledWith(
          SecurityContext.HTML,
          secureSvg
        );
        expect(innerHTML).toBe(sanitizedSvg);
      });

      it('should set the custom style attributes', () => {
        const expectedStyle = 'width: 10px;height: 10px;';
        component.width = 10;
        component.height = 10;
        component.fill = 'red';

        fixture.detectChanges();
        component.ngOnInit();
        const innerHTML: HTMLElement =
          fixture.elementRef.nativeElement.innerHTML;

        expect(innerHTML).toContain(expectedStyle);
      });
    });

    describe('if the src is not a svg', () => {
      it('should not display the icon in the HTML', () => {
        const innerHTML: HTMLElement =
          fixture.elementRef.nativeElement.innerHTML;
        component.src = 'myPhoto.png';
        spyOn(svgService, 'getIconByPath');

        fixture.detectChanges();
        component.ngOnInit();

        expect(svgService.getIconByPath).not.toHaveBeenCalled();
        expect(innerHTML).toBe('');
      });
    });
  });
});
