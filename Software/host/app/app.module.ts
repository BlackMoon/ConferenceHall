import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from "./app.component";
import { AuthModule } from "./common/auth/auth.module";
import { Logger } from "./common/logger";
import { NavigationModule } from './common/navigation/navigation.module';

@NgModule({    
    bootstrap: [AppComponent],
    declarations: [AppComponent],     
    imports: [AuthModule.forRoot(), NavigationModule, BrowserAnimationsModule],
    providers: [Logger]
})
export class AppModule { }