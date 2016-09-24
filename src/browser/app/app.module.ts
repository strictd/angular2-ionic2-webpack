import { NgModule, ApplicationRef } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import { MadameService } from '@strictd/ng2-madame/madame-service';
import { RolePermissions } from '@strictd/ng2-role-permissions/role-permissions';

import { ConfigApp } from '../../../config.app';
import { AuthGuard } from '../auth-guard';

import { SharedModule } from '../modules/shared.module';

import { AuthConfig, AuthHttp, JwtHelper } from 'angular2-jwt';

import { routing } from './app.routing';

import { App }   from '../app/app.component';
import { LoginComponent } from '../components/login/login';
import { Home } from '../components/home/home';

import { LoginService } from '../../services/login-service';

export let customHttpProvider: any = {
  provide: AuthHttp,
  useFactory: (http: any) => {
    let config: AuthConfig = new AuthConfig({
      noJwtError: true,
      tokenName: 'jwt',
      tokenGetter: () => localStorage.getItem('jwt')
    });
    return new AuthHttp(config, http);
  },
  deps: [Http]
};

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule,

    SharedModule,
    routing
  ],
  declarations: [
    App,
    LoginComponent,
    Home
  ],
  providers: [
    customHttpProvider,
    ConfigApp,
    JwtHelper,
    RolePermissions,
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
