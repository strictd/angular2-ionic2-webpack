import { Component, Input, Output, ViewChild, EventEmitter, Renderer, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../../services/login-service/login-service';

import { App } from '../../app';

export interface LoginForm {
  login: string;
  password: string;
  remember_me?: boolean;
}

@Component({
  selector: 'login-component',
  templateUrl: './login.html',
  styleUrls: [ './login.css' ]
})
export class LoginComponent {

  @Input() isModal = false;
  @Output() onSubmit = new EventEmitter(false); // modal login windows subscribes to close window
  @ViewChild('password') elePassword: ElementRef; // allows focus setting for enter key from login to password

  login: LoginService;
  router: Router;
  renderer: Renderer;
  // routeParams: RouteParams;

  loginData: LoginForm = <LoginForm>{};
  runningLogin = false;

  loginMinWidth = 760;
  loginMinHeight = 550;
  loginCurrentWidth = 0;
  loginCurrentHeight = 0;

  constructor(_login: LoginService, _renderer: Renderer, _router: Router) {
    this.login = _login;
    this.renderer = _renderer;
    this.router = _router;
    // this.routeParams = _routeParams;

  }

  onKeyPress(evt) {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      this.renderer.invokeElementMethod(this.elePassword.nativeElement, 'focus', []);
    }
  }
  submitLogin(forwardRoute = 'home') {
    this.runningLogin = true;
    this.login.doLogin(this.loginData.login, this.loginData.password, App._registeredComponents.join(','))
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


        if (this.isModal) {
          this.onSubmit.emit(true);
        } else if (!!forwardRoute) {
          this.router.navigateByUrl(forwardRoute);
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

  modalLoginClose() {
    // this.mono.log('Closing');
  }
  returnToOriginalSize() {
    window.resizeTo(this.loginCurrentWidth, this.loginCurrentHeight);
  }
  resizeForModalLogin() {
    this.loginCurrentWidth = window.outerWidth;
    this.loginCurrentHeight = window.outerHeight;
    if (window.innerWidth < this.loginMinWidth || window.innerHeight < this.loginMinHeight) {
      let addW = this.loginMinWidth - window.innerWidth;
      let addH = this.loginMinHeight - window.innerHeight;
      if (addW < 0) { addW = 0; }
      if (addH < 0) { addH = 0; }
      window.resizeBy(addW, addH);
    }
  }
}
