import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { JwtHelper } from 'angular2-jwt';
import { RolePermissions } from '@strictd/role-permissions/role-permissions';

import { App } from '../../app/app.component';

@Component({
  selector: 'home-page',
  templateUrl: './home.html',
  styleUrls: [ './home.css' ]
})


export class Home implements OnInit, AfterViewInit, OnDestroy {

  // router: Router;
  jwt: JwtHelper;
  p: RolePermissions;

  jwtString: string;
  profile: any;
  observePermissions: any;


  constructor(_jwt: JwtHelper, _p: RolePermissions) {
    // if (!_jwt.fetchJWT()) { this._router.navigate(['Login']); } // Force Page to Login
    // this.router = _router;
    this.jwt = _jwt;
    this.p = _p;


    this.observePermissions = RolePermissions._permissionObserable.subscribe((data) => { console.log('Got Permissions!', data); });
  }

  ngOnInit() {
    this.jwtString = localStorage.getItem('jwt');
    this.profile = this.jwt.decodeToken(this.jwtString);
  }

  ngAfterViewInit() {
    document.body.style.cursor = 'default';
  }

  ngOnDestroy() {
    this.observePermissions.unsubscribe();
  }

  logout() {
    App._loggedOutObserver.next(this);
  }

}
