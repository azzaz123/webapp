import {
  animate,
  AnimationTriggerMetadata,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function Remove(duration: string): AnimationTriggerMetadata {
  return trigger('remove', [
    state('false', style({ opacity: 1, height: '*' })),
    state('true', style({ opacity: 0, height: 0 })),
    transition('0 => 1', [
      animate(
        duration,
        keyframes([
          style({ opacity: 1, height: '*', offset: 0 }),
          style({ opacity: 0, height: '*', offset: 0.5 }),
          style({ opacity: 0, height: 0, padding: 0, offset: 1.0 }),
        ])
      ),
    ]),
  ]);
}
