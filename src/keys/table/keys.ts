import type { InjectionKey } from "vue";

export const recordsKey = Symbol() as InjectionKey<object[]>;
export const attributesKey = Symbol() as InjectionKey<string[]>;
