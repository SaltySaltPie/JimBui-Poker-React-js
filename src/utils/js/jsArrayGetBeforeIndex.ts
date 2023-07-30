export const jsArrayGetBeforeIndex = (arr: any[], index: number) => arr[(index - 1 + arr.length) % arr.length];
