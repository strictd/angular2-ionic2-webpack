import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { ConfigApp, UserPermissions } from '../../config.app';

@Injectable()
export class SecureModPermissions implements OnDestroy {
  config: ConfigApp;

  component_id = 2;

  observePermissions: Subscription;

  permissionToCreate = false;
  permissionToRead = false;
  permissionToUpdate = false;
  permissionToDelete = false;
  permissionToVerify = false;

  constructor(_config: ConfigApp) {
    this.config = _config;
/*
    if (this.config.profile && this.config.profile.permissions) {
      this.setPermissions(this.config.profile.permissions);
    }
    this.observePermissions = ConfigApp._permissionObservable.subscribe(
      perms => this.setPermissions(<UserPermissions>perms)
    );
    */
  }

  ngOnDestroy() {
    // this.observePermissions.unsubscribe();
  }


  // Set Permissions for this page
  setPermissions(perms?: UserPermissions) {
    // CRUD
    this.permissionToCreate = this.config.canCreate(this.component_id, [], perms);
    this.permissionToRead = this.config.canRead(this.component_id, [], perms);
    this.permissionToUpdate = this.config.canUpdate(this.component_id, [], perms);
    this.permissionToDelete = this.config.canDelete(this.component_id, [], perms);

    this.permissionToVerify = this.config.hasPermission(this.component_id, 6);
  }

  ownerCreate(users: number[], perms?: UserPermissions) {
    return this.config.canCreate(this.component_id, users, perms);
  }
  ownerRead(users: number[], perms?: UserPermissions) {
    return this.config.canRead(this.component_id, users, perms);
  }
  ownerUpdate(users: number[], perms?: UserPermissions) {
    return this.config.canUpdate(this.component_id, users, perms);
  }
  ownerDelete(users: number[], perms?: UserPermissions) {
    return this.config.canDelete(this.component_id, users, perms);
  }
}
