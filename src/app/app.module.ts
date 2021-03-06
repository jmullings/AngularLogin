import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomMaterialModule } from './material.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from './app.component';
import { AccountService } from './core/services/account.service';
import { NotFoundComponent } from './core/404/404.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AppRoutingModule } from './/app-routing.module';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LandingComponent,
        RegisterComponent,
        ProfileComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CustomMaterialModule,
        FormsModule,
        AppRoutingModule,
        HttpModule,
        HttpClientModule
    ],
    providers: [AccountService, CookieService],
    bootstrap: [AppComponent]
})
export class AppModule { }