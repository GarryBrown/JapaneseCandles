import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {
  @ViewChild("canvas") public canvas: ElementRef;

  private cx: CanvasRenderingContext2D;
  public width = 400;
  public height = 400;

  ngAfterViewInit() {
    // get the context
    const canvasEl = this.canvas.nativeElement;
    this.cx = canvasEl.getContext("2d");

    // set the width and height
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    this.cx.fillStyle = "black";
    this.cx.fillRect(0, 0, 100, 100);
  }
}
