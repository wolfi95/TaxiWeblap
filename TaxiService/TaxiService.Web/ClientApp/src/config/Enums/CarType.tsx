export enum CarType {
  Executive = 0,
  Luxury = 1,
  SevenSeater = 2
}

export const carTypeString = (r: CarType): string => {
  
  (window as any).carTypeString = carTypeString;
  return r === CarType.Executive ? "Executive" : r === CarType.Luxury ? "Luxury" : "Minibus";
}
//make it available in all windwos
const _global = (window /* browser */ || global /* node */) as any
_global.carTypeString = carTypeString;