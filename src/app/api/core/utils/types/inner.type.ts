import { Unpacked } from './unpacked.type';

export type InnerType<Type, K extends keyof Type> = Unpacked<Type[K]>;
