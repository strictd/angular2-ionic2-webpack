import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { ConfigApp } from '../../../../../config.app';

import { SecureModPermissions } from
    '../../../../permissions/secure-mod-permissions';

import { SecureModService, SecureModInfo } from
    '../../../../services/secure-mod-service';

@Component({
  selector: 'secure-mod-subpage',
  templateUrl: './secure-mod-subpage.html',
  styleUrls: ['./secure-mod-subpage.css']
})
export class SecureModSubpage implements OnInit, OnDestroy {
  @ViewChild('SubInfoModal') SubInfoModal;

  config: ConfigApp;
  permissions: SecureModPermissions;
  service: SecureModService;


  secure_info: SecureModInfo[];

  constructor(_config: ConfigApp, _permissions: SecureModPermissions,
              _service: SecureModService) {
    this.config = _config;
    this.permissions = _permissions;

    this.service = _service;
  }

  ngOnInit() {
    // Initial grab of all secure info
    this.getSecureInfo();
  }

  ngOnDestroy() {

  }

  getSecureInfo() {
    this.service.getData().subscribe(
      resp => this.secure_info = resp,
      err => { }
    );
  }

}
