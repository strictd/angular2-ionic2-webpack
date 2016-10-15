import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ApplicationRef,
    ChangeDetectorRef,  } from '@angular/core';
import { Router } from '@angular/router';

import { MadameService } from '@strictd/ng2-madame/madame-service';

import { Observable, Observer, Subscription } from 'rxjs';
import 'rxjs/add/operator/share';

import '../../style/app.scss';

import { LoginService } from '../../services/login-service';
import { ConfigApp } from '../../../config.app';

/*
 * App Component
 * Top Level Component
 */

@Component({
  selector: 'app-starter',
  template: `<modal style="z-index: 2000;" #ModalLogin
      [hideCloseButton]="false"
      [closeOnEscape]="true"
      [closeOnOutsideClick]="true"
      [showHeader]="false"
      [showFooter]="false"
  >
    <modal-content>
      <login-component #Login [isModal]="true"></login-component>
    </modal-content>
  </modal>

  <div *ngIf="needMoreAuth" (click)="service.reauthMadame()" class="top_auth_window">Needs Authentication!</div>
  <router-outlet></router-outlet>`
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

  login: LoginService;
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
    _login: LoginService,
    _service: MadameService,
    _router: Router
  ) {
    this.cdr = _cdr;
    this.service = _service;
    this.router = _router;
    this.login = _login;

    _service.setServer('main', _config.madameService());
    // this.socket.setServer('main', _config.madameSocket());

    _config.setStateParams();

    // Fetches Auth hook for authorizing and resending stashed que
    this.localMadameStash = _service.getAuthHook().subscribe(
      (resp: boolean) => this.processNeedMoreAuthSub(resp),
      (err) => alert(err)
    );

    // Set madames cursor wait when running;
    _service.getRunningHook().subscribe(
      (isRunning: boolean) => this.processRunningSub(isRunning)
    );

    // Must have at least one subscriber, otherwise next() fails
    this.localAppLogin = App._loggedInObservable.subscribe(
      (data: string) => _config.token = data
    );

    this.localAppLogout = App._loggedOutObservable.subscribe((_t: any) => {
      this.login.doLogoff();
      _config.token = '';
      // Reset to root page
      this.router.navigateByUrl('/');
    });

    this.localForceLogin = App._forceLoginObservable.subscribe(
      (continueObserver: Observer<boolean>) => {

        this.Login.resizeForModalLogin();
        this.ModalLogin.open(continueObserver);
        const closeSub = this.ModalLogin.onClose.subscribe((resp) => {
          continueObserver.complete();
          this.cdr.detectChanges();
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
      const _ob = args[0];
      let continueBool = false;

      const loginSub = this.Login.onSubmit.subscribe((res) => {
        continueBool = res;

        this.ModalLogin.close(res);
        this.cdr.detectChanges();
      });


      // Routine when modal window closes
      const closeSub = this.ModalLogin.onClose.subscribe(successfulLogin => {
        this.Login.returnToOriginalSize(); // Reset original window size,
                                           // may have expanded to fit login

        if (!successfulLogin ||
            !successfulLogin.length ||
            !successfulLogin[0]
        ) {
          this.processNeedMoreAuthSub(true);
        }

        this.needMoreAuth = !continueBool;
        _ob.next(continueBool);
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
