import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { combineLatest } from "rxjs/observable/combineLatest";
import { fromEvent } from "rxjs/observable/fromEvent";
import {
  debounceTime,
  distinctUntilChanged,
  combineLatest as combineLatestPipe
} from "rxjs/operators";

@Injectable()
export class ReadyStateService {
  private subReadyData: Subject<any> = new Subject();
  private subReadyView: Subject<any> = new Subject();
  private allIsReady$;

  constructor() {}

  setReadyData() {
    this.subReadyData.next();
  }

  setReadyView() {
    this.subReadyView.next();
  }

  getReadyData(): Observable<any> {
    return this.subReadyData.asObservable();
  }

  getReadyView(): Observable<any> {
    return this.subReadyView.asObservable();
  }

  getAllReady(): Observable<any> {
    return combineLatest(this.getReadyData(), this.getReadyView());
  }

  onResize(): Observable<any> {
    // pipe is optional but for perfomance we can use it
    // for example
    return fromEvent(window, "resize").pipe(
      debounceTime(100),
      distinctUntilChanged(),
      combineLatestPipe(this.getAllReady())
    );
  }
}
