import { Component } from '@angular/core';

import { App } from '../../../app/app.component';

@Component({
  selector: 'navbar-component',
  templateUrl: './navbar.html',
  styleUrls: [ './navbar.css' ]
})
export class NavbarComponent {
  constructor() { }

  logout() {
    App._loggedOutObserver.next(this);
  }
}
