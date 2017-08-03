import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from "./app.component";
import { AuthModule } from "./common/auth/auth.module";

import { NavigationModule } from './common/navigation/navigation.module';
import { Logger } from "./common/logger";
import { Mediator } from "./common/mediator";
import { Storage } from "./common/storage";

@NgModule({    
    bootstrap: [AppComponent],
    declarations: [AppComponent],     
    imports: [AuthModule.forRoot(), NavigationModule, BrowserAnimationsModule],
    providers: [Logger, Mediator, Storage]
})
export class AppModule { }