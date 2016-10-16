import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
// import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { MadameService } from '@strictd/ng2-madame/madame-service';

import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
import { IonicApp, IonicModule } from 'ionic-angular';

import { App } from './app.component';
import { ConfigApp } from '../../../config.app';

import { LoginService } from '../../services/login-service';


import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { Home } from '../pages/home/home';
import { Login, Logoff } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

import { Storage } from '@ionic/storage';
let storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerName: 'Authorization',
    headerPrefix: 'bearer',
    tokenName: 'jwt',
    tokenGetter: (() => storage.get('jwt')),
    globalHeaders: [{ 'Accept': 'application/json' }],
    noJwtError: true
  }), http);
}

@NgModule({
  declarations: [
    App,
    AboutPage,
    ContactPage,
    Home,
    Login,
    Logoff,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(App)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    App,
    AboutPage,
    ContactPage,
    Home,
    Login,
    Logoff,
    TabsPage
  ],
  providers: [
    ConfigApp,
    Storage,
    MadameService,
    JwtHelper,
    LoginService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    }
  ]
})
export class AppModule {}
