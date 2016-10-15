import { Component } from '@angular/core';

@Component({
  selector: 'navbar-component',
  template: `<ng-content></ng-content>`
})
export class NavbarComponent {
  constructor() { }
}
