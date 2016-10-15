import { NgModule, ApplicationRef } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import { MadameService } from '@strictd/ng2-madame/madame-service';

import { ConfigApp } from '../../../config.app';
import { AuthGuard } from '../auth-guard';

import { SharedModule } from '../modules/shared.module';

import { AuthHttp, JwtHelper, provideAuth } from 'angular2-jwt';

import { appRouting } from './app-routing';

import { App }   from '../app/app.component';
import { Login } from '../components/login/login';
import { Home } from '../components/home/home';
import { SecureModModule } from '../modules/secure-mod/secure-mod-module';

import { LoginService } from '../../services/login-service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule,

    SharedModule,
    SecureModModule,
    appRouting
  ],
  declarations: [
    App,
    Login,
    Home
  ],
  providers: [
    AuthHttp,
    provideAuth({
      headerName: 'Authorization',
      headerPrefix: 'bearer',
      tokenName: 'jwt',
      tokenGetter: (() => localStorage.getItem('jwt')),
      // globalHeaders: [{ 'Content-Type': 'application/json' }],
      noJwtError: true
    }),
    ConfigApp,
    JwtHelper,
    MadameService,
    LoginService,
    AuthGuard
  ],
  bootstrap: [ App ],
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    // console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
