import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { NavigationModule } from './navigation/navigation.module';

@NgModule({    
    bootstrap: [AppComponent],
    declarations: [AppComponent],     
    imports: [AuthModule.forRoot(), NavigationModule, BrowserAnimationsModule]
})
export class AppModule { }