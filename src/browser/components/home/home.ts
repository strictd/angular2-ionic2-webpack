import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { ConfigApp } from '../../../../config.app';

@Component({
  selector: 'home-page',
  templateUrl: './home.html',
  styleUrls: [ './home.css' ]
})


export class Home implements OnInit, AfterViewInit, OnDestroy {

  // router: Router;
  config: ConfigApp;


  constructor(_config: ConfigApp) {
    // if (!_jwt.fetchJWT()) { this._router.navigate(['Login']); } // Force Page to Login
    // this.router = _router;
    this.config = _config;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    document.body.style.cursor = 'default';
  }

  ngOnDestroy() {

  }

  logout() {
    // App._loggedOutObserver.next(this);
  }

}
