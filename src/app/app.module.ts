import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';

import { MomentModule } from 'angular2-moment';

import { ChatsPage } from './../pages/chats/chats';
import { MessagesPage } from './../pages/messages/messages';
import { PhoneService } from '../services/phone';
import { LoginPage } from '../pages/login/login';
import { VerificationPage } from './../pages/verification/verification';

@NgModule({
  declarations: [MyApp, ChatsPage, MessagesPage, LoginPage, VerificationPage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp), MomentModule],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ChatsPage,
    MessagesPage,
    LoginPage,
    VerificationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PhoneService
  ]
})
export class AppModule {}
