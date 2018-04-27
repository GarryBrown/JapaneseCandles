import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  OnDestroy
} from "@angular/core";
import {
  DataService,
  UtilsService,
  DrawerService,
  ReadyStateService
} from "./core/services";
import { ItemData, OriginData } from "./core/interfaces";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";

import { debounceTime, distinctUntilChanged, delay } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("canvas") public canvas: ElementRef;

  private cx: CanvasRenderingContext2D;
  private canvasEl: any;
  public width = 800;
  public height = 400;
  public listData: ItemData[];
  public id: number;
  public s: string;
  private maxValue: number;
  private minValue: number;
  private perPX: number; // 1% of height
  private per: number; // 1% of data.h
  private subscribtionWindow: Subscription;
  private subscribtionReadyChart: Subscription;

  constructor(
    private dataService: DataService,
    private utilsService: UtilsService,
    private drawerService: DrawerService,
    private readyStateService: ReadyStateService
  ) {
    // redraw only when data and view are ready
    this.subscribtionWindow = this.readyStateService
      .onResize()
      .subscribe(([e, args]) => {
        const widthParams = this.utilsService.getWindowAndScrollBar(e.target);
        this.changeWidth(widthParams);
      });
  }

  changeWidth({ width, widthScrllBar }) {
    const newWidth = this.utilsService.getPossibleWidth(width, widthScrllBar);
    if (this.canvasEl.width !== newWidth) {
      this.canvasEl.width = newWidth;
      requestAnimationFrame(() => this.drawerService.redraw(this.cx));
    }
  }

  ngAfterViewInit() {
    // get the context
    this.canvasEl = this.canvas.nativeElement;
    this.cx = this.canvasEl.getContext("2d");
    // set the width and height
    this.canvasEl.height = this.height;
    const widthParams = this.utilsService.getWindowAndScrollBar();
    this.changeWidth(widthParams);
    this.readyStateService.setReadyView();
  }

  ngOnInit() {
    this.getData();
    this.readyStateService.getAllReady().subscribe(val =>
      this.drawerService.drawCharts(this.cx, this.listData, {
        widthItem: 10,
        per: this.per,
        perPX: this.perPX,
        marginRight: 5,
        zoom: 4,
        offsetY: -100
      })
    );
  }

  ngOnDestroy() {
    this.subscribtionWindow.unsubscribe();
    this.subscribtionReadyChart.unsubscribe();
  }

  getData() {
    this.subscribtionReadyChart = this.dataService
      .getData()
      .subscribe((data: OriginData) => {
        this.id = data.id;
        this.maxValue = this.utilsService.getMax(data.h);
        this.minValue = this.utilsService.getMin(data.h);
        this.per = this.maxValue / 100;
        this.perPX = this.height / 100 * 1;
        this.s = data.s;
        this.listData = this.utilsService.prepareData(data);
        this.readyStateService.setReadyData();
      });
  }
}
