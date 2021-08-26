import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpModule } from '@core/http/http.module';
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
    let bubbleText = 'bubbleText';
    beforeEach(() => {
      component.bubbleText = bubbleText;
      fixture.detectChanges();
    });
    it('should show text in bubble', () => {
      const bubbleText = debugElement.query(By.css('span')).nativeNode.innerHTML;

      expect(bubbleText).toBe(bubbleText);
    });

    describe('when we click the cross', () => {
      it('should emit the text of the bubble', () => {
        spyOn(component.clear, 'emit');
        const crossIcon = debugElement.query(By.css('tsl-svg-icon')).nativeNode;

        crossIcon.click();

        expect(component.clear.emit).toHaveBeenCalledWith(bubbleText);
      });
    });
  });
});
