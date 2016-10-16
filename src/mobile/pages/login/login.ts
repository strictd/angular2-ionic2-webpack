import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { LoginService } from '../../../services/login-service';

import { App } from '../../app/app.component';

// import { JwtHelper } from 'angular2-jwt';
// import { AuthService } from '../../auth';
// import 'rxjs/add/operator/map'

export interface LoginForm {
  login: string;
  password: string;
}

@Component({
  selector: 'page-logoff',
  template: '<div>Logged Off!</div>'
})
export class Logoff {
  constructor() {
    App._loggedOutObserver.next(true);
  }
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  service: LoginService;
  nav: NavController;

  runningLogin: boolean;

  loginData: LoginForm = <LoginForm>{};

  constructor(_service: LoginService, _nav: NavController) {
    this.service = _service;
    this.nav = _nav;
    this.runningLogin = false;
  }


  submitLogin(forwardRoute = TabsPage) {
    this.runningLogin = true;
    this.service.doLogin(this.loginData.login, this.loginData.password, App._registeredComponents.join(','))
    .subscribe(
      resp => {

        this.cleanForm();

        let dataSet = resp.json();

        if (typeof dataSet.id_token !== 'undefined') {
          // let jwtToken = this.jwt.parseJWT(dataSet.id_token);
          App._loggedInObserver.next(dataSet.id_token);
        } else {
          alert('No Token Returned, Please Refresh. Sorry!');
        }

        if (!!forwardRoute) {
          this.nav.setRoot(forwardRoute);
        } else { alert('No Where to Go!'); }

      },
      err => {
        this.cleanPassword();
        this.runningLogin = false;
      }
    );
  }

  cleanForm() {
    this.loginData.login = '';
    this.cleanPassword();
    this.runningLogin = false;
  }
  cleanPassword() {
    this.loginData.password = '';
  }

}
