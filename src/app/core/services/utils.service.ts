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

  getScrollbarWidth(innerWidth) {
    return innerWidth - document.documentElement.clientWidth;
  }

  getPossibleWidth(w, wScrollBar): number {
    return w > 800 ? w - wScrollBar : 800;
  }

  getWindowAndScrollBar(win?: Window) {
    win = win || window;
    const width = win.innerWidth;
    const widthScrllBar = this.getScrollbarWidth(width);
    return { width, widthScrllBar };
  }

  formatDate(date: Date) {
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${hour}:${min}:${sec}`;
  }
}
