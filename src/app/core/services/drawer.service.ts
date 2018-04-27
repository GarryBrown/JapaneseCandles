import { UtilsService } from "./utils.service";
import { Injectable } from "@angular/core";
import { ItemData, DrawerConfig } from "../interfaces";

@Injectable()
export class DrawerService {
  private config: DrawerConfig;
  private cacheData: Object[];
  constructor(private utilsService: UtilsService) {
    this.cacheData = [];
  }

  drawRect(
    cx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    cx.fillRect(x, y, w, h);
  }

  drawLine(cx: CanvasRenderingContext2D, x: number, y: number, y2: number) {
    cx.beginPath();
    cx.moveTo(x, y);
    cx.lineTo(x, y2);
    cx.stroke();
  }

  drawTimeLine(cx: CanvasRenderingContext2D, x: number, x2: number, y: number) {
    cx.strokeStyle = "black";
    cx.beginPath();
    cx.moveTo(x, y);
    cx.lineTo(x2, y);
    cx.stroke();
  }

  setFillColor(cx: CanvasRenderingContext2D, color: string) {
    cx.fillStyle = color;
    cx.strokeStyle = color;
  }

  drawText(cx: CanvasRenderingContext2D, text: string, x: number, y: number) {
    cx.fillText(text, x, y + 15);
  }

  drawCharts(cx, listData: ItemData[], config: DrawerConfig) {
    const widthItem = config.widthItem || 10;
    const marginRight = config.marginRight || 5;
    this.config = config;
    listData.map((item, i) => this.drawCandles(item, cx, i, widthItem, config));
    requestAnimationFrame(() => this.redraw(cx));
  }

  drawCandles(
    item: ItemData,
    cx: CanvasRenderingContext2D,
    offset: number,
    width: number,
    config: DrawerConfig
  ) {
    // ofs is startX for current item
    const ofsX = offset ? offset * width + offset * config.marginRight : 0;
    const center = ofsX ? ofsX + width / 2 : width / 2;

    // this.setFillColor(cx, item.c < item.o);

    let y: any = {
      h: (100 - item.h / config.per) * config.perPX,
      l: (100 - item.l / config.per) * config.perPX,
      o: (100 - item.o / config.per) * config.perPX,
      c: (100 - item.c / config.per) * config.perPX
    };
    // for better zoom and position
    Object.keys(y).map(key => (y[key] = y[key] * config.zoom + config.offsetY));
    y = {
      ofsX,
      center,
      t: item.t,
      ...y
    };
    this.cacheData = [...this.cacheData, y];
  }

  redraw(cx: CanvasRenderingContext2D) {
    this.cacheData.map((item: any, i) => {
      cx.font = "10px Arial";
      const x2TimeLine =
        item.ofsX + this.config.widthItem + this.config.marginRight;
      this.drawTimeLine(cx, item.ofsX, x2TimeLine, 300);
      if (!(i % 3)) {
        this.setFillColor(cx, "gray");
        const textTime = this.utilsService.formatDate(new Date(item.t));
        this.drawText(cx, textTime, item.ofsX, 300);
        this.setFillColor(cx, "rgba(0,0,0,0.1");
        this.drawLine(cx, item.center, 0, 300);
      }

      // pre invert above
      this.setFillColor(cx, item.c > item.o ? "red" : "green");
      // top shadow
      this.drawLine(cx, item.center, item.h, item.o);
      // bottom shadow
      this.drawLine(cx, item.center, item.c, item.l);

      let heightRect = item.c - item.o;
      this.drawRect(cx, item.ofsX, item.o, this.config.widthItem, heightRect);
    });
  }
}
