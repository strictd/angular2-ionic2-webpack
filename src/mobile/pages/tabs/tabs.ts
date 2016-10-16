import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';

import { ConfigApp } from '../../../../config.app';

import { App } from '../../app/app.component';

import { Observable } from 'rxjs';

import { Home } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { Login, Logoff } from '../login/login';

import { Storage } from '@ionic/storage';
import { tokenNotExpired } from 'angular2-jwt';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  storage: Storage;
  nav: Nav;
  config: ConfigApp;

  pages: Array<{title: string, icon: string, component?: any, select?: any}>;

  constructor(_storage: Storage, _config: ConfigApp, _nav: Nav) {
    this.storage = _storage;
    this.config = _config;
    this.nav = _nav;

    this.pages = [
      { title: 'Homepage', icon: 'home', component: Home},
      { title: 'About', icon: 'information-circle', component: AboutPage },
      { title: 'Contact', icon: 'contacts', component: ContactPage },
      { title: 'Logout', icon: 'contacts', component: Logoff }
    ];

    _storage.get('jwt').then((token) => {
      if (!tokenNotExpired(null, token)) {
        this.restrictAll();
      }
    }).catch(err => {
      this.restrictAll();
    });
  }

  restrictAll() {
    this.pages = [];
    this.nav.setRoot(Login);
  }

  newRoot(page) {
    this.storage.get('jwt').then((token) => {
      if (!tokenNotExpired(null, token)) {
        console.log('Not Authed!, Trying');

        Observable.create(observer => {
          App._forceLoginObserver.next(observer);
        }).subscribe((resp) => {
          if (resp === true) {
            this.nav.setRoot(page);
          } else {
            console.log('Wrote Auth 1');
          }
        },
        (err) => {
          console.log('Wrong Auth 2');
        });

      } else {
        // navigate to the new page if it is not the current page
        this.nav.setRoot(page);
      }
    }).catch(err => {
      this.restrictAll();
    });
  }

  openPage(page) {
    console.log('Open Page', page);
    this.newRoot(page.component);
  }

  doLogOut() {
    console.log('Logoff');
  }
}
