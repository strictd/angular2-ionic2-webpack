import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { CanActivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot } from '@angular/router';

import { tokenNotExpired } from 'angular2-jwt';

import { App } from './app/app.component';

@Injectable()
export class AuthGuard implements CanActivate {

  forceObservable: Observable<any>;
  forceObserver: Observer<any>;

  constructor(private _http: Http) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (tokenNotExpired('jwt')) {
      // Good Auth
      return Observable.of(true);
    }

    // Not so good Auth
    this.forceObservable = new Observable(observer => {
      this.forceObserver = observer;
      App._forceLoginObserver.next(this.forceObserver); // Fire login Modal
    });
    return this.forceObservable;
  }

}
