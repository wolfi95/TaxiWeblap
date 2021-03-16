export enum CarType {
  Executive = 0,
  Luxury = 1,
  SevenSeater = 2
}

export const carTypeString = (r: CarType): string => {
  return r === CarType.Executive ? "Executive" : r === CarType.Luxury ? "Luxury" : "Minibus";
}