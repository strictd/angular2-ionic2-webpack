import { Component, OnInit, OnDestroy } from '@angular/core';

import { ConfigApp } from '../../../../../config.app';

import { SecureModPermissions } from '../../../../permissions/secure-mod-permissions';

@Component({
  selector: 'secure-mod-index',
  templateUrl: './secure-mod-index.html',
  styleUrls: ['./secure-mod-index.css']
})

export class SecureModIndex implements OnInit, OnDestroy {
  config: ConfigApp;
  permissions: SecureModPermissions;

  constructor(_config: ConfigApp, _permissions: SecureModPermissions) {
    this.config = _config;
    this.permissions = _permissions;
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
