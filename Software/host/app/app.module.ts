import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser"; import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { NavigationModule } from './navigation/navigation.module';

@NgModule({    
    bootstrap: [AppComponent],
    declarations: [AppComponent],     
    imports: [AuthModule.forRoot(), NavigationModule, BrowserModule]
})
export class AppModule { }