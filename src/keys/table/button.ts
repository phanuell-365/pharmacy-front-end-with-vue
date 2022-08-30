import type { InjectionKey } from "vue";

export const buttonNameKey = Symbol() as InjectionKey<string>;
export const buttonEditIconKey = Symbol() as InjectionKey<string>;
export const buttonViewIconKey = Symbol() as InjectionKey<string>;
export const clickableKey = Symbol() as InjectionKey<boolean>;
export const routeEndPointKey = Symbol() as InjectionKey<string>;
