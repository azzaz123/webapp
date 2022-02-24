import * as _mParticle from '@mparticle/web-sdk';
// @ts-ignore
// Hacky way to be able to use mParticle typings without setting up synthetic default imports
export const mParticle = _mParticle.default as unknown as typeof _mParticle;

import * as _appboyKit from '@mparticle/web-appboy-kit';
export const appboyKit = _appboyKit.default;
