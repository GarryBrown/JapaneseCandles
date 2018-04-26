import { OriginData, ItemData } from "./../interfaces";
import { Injectable } from "@angular/core";

@Injectable()
export class UtilsService {
  private listPropsArray: string[];
  constructor() {
    this.listPropsArray = ["c", "h", "l", "o", "t", "v"];
  }

  prepareData(obj: OriginData): ItemData[] {
    if (this.validate(obj)) {
      return obj.c.map((v, i) => ({
        c: v,
        h: obj.h[i],
        l: obj.l[i],
        o: obj.o[i],
        t: obj.t[i],
        v: obj.v[i]
      }));
      // return obj;
    }
    throw new Error("invalid data");
  }

  validate(obj: OriginData) {
    return this.listPropsArray.every(prop =>
      this.listPropsArray.every(
        otherProp => obj[prop].length === obj[otherProp].length
      )
    );
  }

  getMax(numArray: number[]) {
    return Math.max.apply(null, numArray);
  }

  getMin(numArray: number[]) {
    return Math.min.apply(null, numArray);
  }
}
