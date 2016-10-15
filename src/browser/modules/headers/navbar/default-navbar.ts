import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { App } from '../../../app/app.component';

import { ConfigApp } from '../../../../../config.app';

@Component({
  selector: 'default-navbar',
  template: `
    <div class="row navbar-component">
      <div class="col">&nbsp;</div>
      <div class="col"><a [routerLink]="['/']">Home</a></div>
      <div class="col"><a [routerLink]="['/secure']">Secure Mod</a></div>
      <div class="col" *ngIf="config.isLoggedIn"><a role="button" (click)="logout()"><u>L</u>og Out</a></div>
      <div class="col" *ngIf="!config.isLoggedIn"><a role="button" (click)="login()"><u>L</u>og In</a></div>
  
      <div class="col">&nbsp;</div>
    </div>
  `
})
export class DefaultNavbar {
  config: ConfigApp;

  constructor(_config: ConfigApp) {
    this.config = _config;
  }

  login() {
    new Observable(observer => {
      App._forceLoginObserver.next(observer); // Fire login Modal
    }).subscribe(resp => {
      // resp has the id_token for jwt

    });
  }

  logout() {
    App._loggedOutObserver.next(this);
  }
}
