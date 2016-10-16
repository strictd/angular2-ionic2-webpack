import { Component, OnInit, ViewChild } from '@angular/core';

import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { MadameService } from '@strictd/ng2-madame/madame-service';

import { Observable, Subscription } from 'rxjs';

import { ConfigApp } from '../../../config.app';

import { Loading } from '../pages/loading/loading';
import { Login } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

import { Storage } from '@ionic/storage';
import { tokenNotExpired } from 'angular2-jwt';

@Component({
  template: `<ion-nav #nav [root]="rootPage"></ion-nav>`
})
export class App implements OnInit {
  // Observers for Tracking Logins between modules
  static _loggedInObserver;
  static _loggedInObservable = new Observable(observer => {
   App._loggedInObserver = observer; // Assign to static App._loggedInObserver
  }).share();

  static _loggedOutObserver;
  static _loggedOutObservable = new Observable(observer => {
   App._loggedOutObserver = observer; // Assign to static App._loggedOutObserver
  }).share();

  static _forceLoginObserver;
  static _forceLoginObservable = new Observable(observer => {
   App._forceLoginObserver = observer; // Assign to static App._loggedOutObserver
  }).share();

  static _registeredComponents = [1, 2, 3, 6];

  @ViewChild('nav') nav: NavController;

  storage: Storage;

  needMoreAuth = false;

  localAppLogin: Subscription;
  localAppLogout: Subscription;
  localForceLogin: Subscription;
  localMadameStash: Subscription;

  rootPage: any = Loading;

  constructor(private platform: Platform,
    _config: ConfigApp,
    _service: MadameService,
    _storage: Storage,
  ) {
    this.initializeApp();

    this.storage = _storage;
    _storage.get('jwt').then((token) => {
      if (tokenNotExpired(null, token)) {
        _config.token = token;
        this.rootPage = TabsPage;
      } else {
        this.rootPage = Login;
      }
    }).catch(err => this.rootPage = Login);

    _service.setServer('main', _config.madameService());
    _service.setLoginObserver(App._forceLoginObserver);

    this.localMadameStash = _service.getAuthHook().subscribe(
      (resp: boolean) => this.processNeedMoreAuthSub(resp),
      (err) => alert(err)
    );

    // Set madames cursor wait when running;
    _service.getRunningHook().subscribe(
      (isRunning: boolean) => this.processRunningSub(isRunning)
    );

    this.localAppLogin = App._loggedInObservable.subscribe(
      (data: string) => {
        _storage.set('jwt', data);
        _config.token = data;
      }
    );

    this.localAppLogout = App._loggedOutObservable.subscribe((_t: any) => {
      _storage.remove('jwt');
      _config.token = '';
      this.nav.setRoot(Login);
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  ngOnInit() {
    // App._loggedInObserver.next({});
  }

  processNeedMoreAuthSub(needsMore: boolean) {
    this.needMoreAuth = needsMore;
  }

  processRunningSub(isRunning: boolean) {
    if (isRunning) {
      // document.body.style.cursor = 'wait';
    } else {
      // document.body.style.cursor = 'default';
    }
  }
}
