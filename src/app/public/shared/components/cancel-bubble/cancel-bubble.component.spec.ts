import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpModule } from '@core/http/http.module';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { CancelBubbleComponent } from './cancel-bubble.component';

describe('CancelBubbleComponent', () => {
  let component: CancelBubbleComponent;
  let fixture: ComponentFixture<CancelBubbleComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgIconModule, CommonModule, HttpModule],
      declarations: [CancelBubbleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelBubbleComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CancelBubble behavior', () => {
    let text = 'text';
    beforeEach(() => {
      component.text = text;
      fixture.detectChanges();
    });
    it('should show text in bubble', () => {
      const text = debugElement.query(By.css('span')).nativeNode.innerHTML;

      expect(text).toBe(text);
    });

    describe('when we click the cross', () => {
      it('should emit the text of the bubble', () => {
        spyOn(component.clear, 'emit');
        const crossIcon = debugElement.query(By.directive(SvgIconComponent)).nativeNode;

        crossIcon.click();

        expect(component.clear.emit).toHaveBeenCalledWith(text);
      });
    });
  });
});
