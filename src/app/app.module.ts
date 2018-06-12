import { MessagesPage } from './../pages/messages/messages';
import { ChatsPage } from './../pages/chats/chats';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MomentModule } from 'angular2-moment';

import { MyApp } from './app.component';
import { PhoneService } from '../services/phone';

@NgModule({
  declarations: [MyApp, ChatsPage, MessagesPage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp), MomentModule],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, ChatsPage, MessagesPage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PhoneService
  ]
})
export class AppModule {}
