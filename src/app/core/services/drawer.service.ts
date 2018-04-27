import { Injectable } from "@angular/core";
import { ItemData, DrawerConfig } from "../interfaces";

@Injectable()
export class DrawerService {
  private config: DrawerConfig;
  constructor() {
  }

  drawRect(cx, x, y, w, h) {
    cx.fillRect(x, y, w, h);
  }

  drawLine(cx, x, y, y2) {
    cx.beginPath();
    cx.moveTo(x, y);
    cx.lineTo(x, y2);
    cx.stroke();
  }

  drawCharts(cx, listData: ItemData[], config: DrawerConfig) {
    const widthItem = config.widthItem || 10;
    const marginRight = config.marginRight || 5;
    this.config = config;
    listData.map((item, i) => this.drawCandles(item, cx, i, widthItem, config));
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
    
    const y = {
      ofsX,
      center,
      h: (100 - item.h / config.per) * config.perPX,
      l: (100 - item.l / config.per) * config.perPX,
      o: (100 - item.o / config.per) * config.perPX,
      c: (100 - item.c / config.per) * config.perPX
    };
    // for better zoom and position
    Object.keys(y).map(key => (y[key] = y[key] * config.zoom + config.offsetY));
    // pre invert above
    this.setFillColor(cx, y.c > y.o);
    // top shadow
    this.drawLine(cx, y.center, y.h, y.o);
    // bottom shadow
    this.drawLine(cx, y.center, y.c, y.l);

    let heightRect = y.c - y.o;
    this.drawRect(cx, ofsX, y.o, config.widthItem, heightRect);
  }

  setFillColor(cx, isToRed) {
    const color = isToRed ? "red" : "green";
    cx.fillStyle = color;
    cx.strokeStyle = color;
  }

  redraw(cx) {

  }
}
