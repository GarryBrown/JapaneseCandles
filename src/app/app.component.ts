import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit
} from "@angular/core";
import { DataService, UtilsService, DrawerService } from "./core/services";
import { ItemData, OriginData } from "./core/interfaces";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("canvas") public canvas: ElementRef;

  private cx: CanvasRenderingContext2D;
  public width = 400;
  public height = 400;
  public listData: ItemData[];
  public id: number;
  public s: string;
  private maxValue: number;
  private minValue: number;
  private perPX: number; // 1% of height
  private per: number; // 1% of data.h

  constructor(
    private dataService: DataService,
    private utilsService: UtilsService,
    private drawerService: DrawerService
  ) {}

  ngAfterViewInit() {
    // get the context
    const canvasEl = this.canvas.nativeElement;
    this.cx = canvasEl.getContext("2d");
    // set the width and height
    canvasEl.width = this.width;
    canvasEl.height = this.height;
  }

  ngOnInit() {
    // сделать штуку ваш браузер не поддерживает канвас
    this.getData();
  }

  getData() {
    this.dataService.getData().subscribe((data: OriginData) => {
      console.log(data);
      this.id = data.id;
      this.maxValue = this.utilsService.getMax(data.h);
      this.minValue = this.utilsService.getMin(data.h);
      this.per = this.maxValue / 100;
      this.perPX = this.height / 100 * 1;
      console.log("1% = ", this.per);
      console.log(`1% =  ${this.perPX}px`);
      this.s = data.s;
      this.listData = this.utilsService.prepareData(data);
      console.log(this.listData);
      this.drawerService.drawCharts(this.cx, this.listData, {
        widthItem: 10,
        per: this.per,
        perPX: this.perPX,
        marginRight: 5,
        zoom: 5,
        offsetY: -200
      });
    });
  }
  //использовать подписку, когда afterInit и dataready запускать функцию
}
