import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  AnimationTriggerMetadata,
  state,
} from '@angular/animations';

export const ITEM_STATS_ROW_ANIMATION: AnimationTriggerMetadata = trigger(
  'collapse',
  [
    state(
      'false',
      style({
        opacity: '1',
        overflow: 'visible',
        height: '*',
      })
    ),
    state(
      'true',
      style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
      })
    ),
    transition(
      'false => true',
      animate(
        '.3s ease-in',
        keyframes([
          style({
            overflow: 'visible',
            height: '*',
            opacity: '1',
            offset: 0,
          }),
          style({
            overflow: 'hidden',
            height: '*',
            opacity: '1',
            offset: 0.01,
          }),
          style({
            overflow: 'hidden',
            height: '0px',
            opacity: '0',
            offset: 1,
          }),
        ])
      )
    ),
    transition(
      'true => false',
      animate(
        '.3s ease-out',
        keyframes([
          style({
            overflow: 'hidden',
            height: '0px',
            opacity: '0',
            offset: 0,
          }),
          style({
            overflow: 'hidden',
            height: '*',
            opacity: '1',
            offset: 0.99,
          }),
          style({
            overflow: 'visible',
            height: '*',
            opacity: '1',
            offset: 1,
          }),
        ])
      )
    ),
  ]
);
