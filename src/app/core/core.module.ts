import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { DataService, UtilsService, DrawerService } from "./services";
const PROVIDERS = [DataService, UtilsService, DrawerService];

@NgModule({
  imports: [CommonModule, HttpClientModule]
})
export class CoreModule {
  // предотвращение повторной загрузки core
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(
        "CoreModule is already loaded. Import it in the AppModule only"
      );
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [...PROVIDERS]
    };
  }
}
