import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SvgService } from '../svg.service';

import { SvgIconComponent } from './svg-icon.component';

describe('SvgIconComponent', () => {
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;
  let svgService: SvgService;
  let domSanitizer: DomSanitizer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [SvgIconComponent],
      providers: [
        {
          provide: ElementRef, useValue: {
            nativeElement: {}
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

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

  describe('ngOnInit()', () => {
    describe('should do calls', () => {
      beforeEach(() => {
        component.src = 'mySvg.svg';
        fixture.detectChanges();
        spyOn(svgService, 'getIconByPath').and.returnValue(of(component.src));

      });

      it('should call svgService', () => {
        component.ngOnInit();

        expect(svgService.getIconByPath).toHaveBeenCalled();
      });

      it('should call Sanitizer', () => {
        spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.returnValue('svgElement');
        spyOn(domSanitizer, 'sanitize').and.returnValue('safeSvg');

        component.ngOnInit();

        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(component.src);
        expect(domSanitizer.sanitize).toHaveBeenCalled();
      });
    });

    describe('shouldnt make calls', () => {
      it('shouldnt call svgService', () => {
        component.src = 'myPhoto.png';
        spyOn(svgService, 'getIconByPath');

        fixture.detectChanges();
        component.ngOnInit();

        expect(svgService.getIconByPath).not.toHaveBeenCalled();
      });
    });
  });

});
