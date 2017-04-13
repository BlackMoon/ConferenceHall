﻿import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser"; import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { AppRoutingModule } from './app-routing.module';

@NgModule({    
    bootstrap: [AppComponent],
    declarations: [AppComponent],     
    imports: [AuthModule.forRoot(), AppRoutingModule, BrowserModule]
})
export class AppModule { }