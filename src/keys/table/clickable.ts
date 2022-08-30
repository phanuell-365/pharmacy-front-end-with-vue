import type { InjectionKey } from "vue";

export const clickableKey = Symbol() as InjectionKey<boolean>;
export const routeStartPointKey = Symbol() as InjectionKey<string>;
export const routeEndPointKey = Symbol() as InjectionKey<string>;
