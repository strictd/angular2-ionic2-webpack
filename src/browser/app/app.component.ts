import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ApplicationRef,
    ChangeDetectorRef,  } from '@angular/core';
import { Router,  } from '@angular/router';

import { RolePermissions } from '@strictd/ng2-role-permissions/role-permissions';
import { MadameService } from '@strictd/ng2-madame/madame-service';

import { JwtHelper } from 'angular2-jwt';

import { Observable, Observer, Subscription } from 'rxjs';
import 'rxjs/add/operator/share';

import '../../style/app.scss';

import { ConfigApp } from '../../../config.app';

/*
 * App Component
 * Top Level Component
 */

@Component({
  selector: 'app-starter',
  template: `<modal #ModalLogin
      [hideCloseButton]="false"
      [closeOnEscape]="true"
      [closeOnOutsideClick]="true"
  >
    <modal-content>
      <login-component #Login [isModal]="true"></login-component>
    </modal-content>
  </modal>

  <div *ngIf="needMoreAuth" (click)="service.reauthMadame()" class="top_auth_window">Needs Authentication!</div>
  <router-outlet></router-outlet>`,
  styles: [''],
})

export class App implements OnInit, AfterViewInit, OnDestroy {

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
   App._forceLoginObserver = observer; // Assign to static
                                       // App._loggedOutObserver
  }).share();

  static _registeredComponents = [1, 2, 11, 12];

  @ViewChild('ModalLogin') ModalLogin;
  @ViewChild('Login') Login;

  runningLogin: boolean = false;

  jwt: JwtHelper;
  p: RolePermissions;
  applicationRef: ApplicationRef;
  cdr: ChangeDetectorRef;
  service: MadameService;
  router: Router;

  prevHistoryStateId: number;
  backClick: boolean;

  needMoreAuth = false;

  localAppLogin: Subscription;
  localAppLogout: Subscription;
  localForceLogin: Subscription;
  localMadameStash: Subscription;

  constructor(
    _config: ConfigApp,
    _cdr: ChangeDetectorRef,
    _jwt: JwtHelper,
    _p: RolePermissions,
    _service: MadameService,
    _router: Router
  ) {
    this.cdr = _cdr;
    this.jwt = _jwt;
    this.p = _p;
    this.service = _service;
    this.router = _router;

    _service.setServer('main', _config.madameService());
    // this.socket.setServer('main', _config.madameSocket());

    _config.setStateParams();

    let jwtDecoded = localStorage.getItem('jwt') || '';
    if (jwtDecoded) { _config.setProfile(this.jwt.decodeToken(jwtDecoded)); }

    // Fetches Auth hook for authorizing and resending stashed que
    this.localMadameStash = _service.getAuthHook().subscribe(
      (resp: boolean) => this.processNeedMoreAuthSub(resp),
      (err) => console.log('My Err', err)
    );

    // Set madames cursor wait when running;
    _service.getRunningHook().subscribe(
      (isRunning: boolean) => this.processRunningSub(isRunning)
    );

    // Must have at least one subscriber, otherwise next() fails
    this.localAppLogin = App._loggedInObservable.subscribe((data: string) => {
      let decoded = this.jwt.decodeToken(data);

      if (!!decoded) { _config.setProfile(decoded); }
      if (!!decoded && typeof decoded.permission !== 'undefined' &&
          typeof decoded.permission.permissions !== 'undefined') {

        this.p.savePermissions();
        // let permSet = this.p.setPermissions(decoded.permission.permissions);
        // RolePermissions._permissionObserver.next(permSet);
        // this.p.fetchComponentPermission(App._registeredComponents);
        // this.socket.openSocket('main', this.jwtToken);
      }
    });
    this.localAppLogout = App._loggedOutObservable.subscribe((_t: any) => {
      _config.setProfile({});
      this.p.resetPermissions();

      // Reset to root page
      this.router.navigateByUrl('/');
    });

    this.localForceLogin = App._forceLoginObservable.subscribe(
      (authGuardObserver: Observer<boolean>) => {

        this.Login.resizeForModalLogin();
        this.ModalLogin.open(authGuardObserver);
        let closeSub = this.ModalLogin.onClose.subscribe((resp) => {
          authGuardObserver.complete();
          closeSub.unsubscribe();
        });
      }
    );

  }

  ngOnInit() {
    // Set madames login modal stream trigger
    this.service.setLoginObserver(App._forceLoginObserver);

  }

  ngAfterViewInit() {
    // Modal Login window open default
    this.ModalLogin.onOpen.subscribe(args => {
      let _ob = args[0];

      let loginSub = this.Login.onSubmit.subscribe((res) => {
        _ob.next(res);
        _ob.complete();
        this.ModalLogin.close(res);
        this.cdr.detectChanges();
      });


      // Routine when modal window closes
      let closeSub = this.ModalLogin.onClose.subscribe(successfulLogin => {
        this.Login.returnToOriginalSize(); // Reset original window size,
                                           // may have expanded to fit login

        if (!successfulLogin ||
            !successfulLogin.length ||
            !successfulLogin[0]
        ) {
          this.processNeedMoreAuthSub(true);
        }

        _ob.next('closed');
        _ob.complete();

        // Cleanup subscriptions from modal window
        loginSub.unsubscribe();
        closeSub.unsubscribe();

      });

    });
  }

  ngOnDestroy() {
    try { this.ModalLogin.close(); } catch (e) { }

    this.localAppLogin.unsubscribe();
    this.localAppLogout.unsubscribe();
    this.localForceLogin.unsubscribe();
    this.localMadameStash.unsubscribe();

    App._loggedInObserver.dispose();
    App._loggedOutObserver.dispose();
    App._forceLoginObserver.dispose();

  }

  logout() {
    App._loggedOutObserver.next(this);
  }

  processNeedMoreAuthSub(needsMore: boolean) {
    this.needMoreAuth = needsMore;
  }

  processRunningSub(isRunning: boolean) {
    if (isRunning) {
      document.body.style.cursor = 'wait';
    } else {
      document.body.style.cursor = 'default';
    }
  }

}
