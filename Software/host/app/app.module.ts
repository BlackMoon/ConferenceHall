import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from "./app.component";
import { AuthModule } from "./common/auth/auth.module";
import { Logger } from "./common/logger";
import { MatchHeightDirective } from "./common/match-height.directive";
import { Mediator } from "./common/mediator";
import { NavigationModule } from './common/navigation/navigation.module';

@NgModule({    
    bootstrap: [AppComponent],
    declarations: [AppComponent, MatchHeightDirective],     
    imports: [AuthModule.forRoot(), NavigationModule, BrowserAnimationsModule],
    providers: [Logger, Mediator]
})
export class AppModule { }