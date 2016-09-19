import { Injectable } from '@angular/core';
import { RolePermissions, UserPermissions } from '@strictd/ng2-role-permissions/role-permissions';

@Injectable()
export class ConfigApp {
  // Modified in gulpfile.js task 'configs'
  private _madameService = 'http://localhost:3080/';
  private _madameSocket = 'localhost:3080';

  private _profile: any;

  private _curHistoryLength = 0;
  private _historyHandicap = 1;
  private _permissions: UserPermissions;

  constructor(private _rp: RolePermissions) {}

  madameService(): string { return this._madameService; }
  madameSocket(): string { return this._madameSocket; }

  setProfile(profile: any): void { this._profile = profile; }
  getProfile(): any { return this._profile; }

  setPermissions(permissions: UserPermissions): void {
    this._permissions = permissions;
    console.log('set permissions: ', permissions);
  }

  getPermissions(): UserPermissions { return this._permissions; }

  isPopupWindow(window: Window) {
    if (window.opener) {
      return true; // Popup Window
    } else if (window.top !== window.self) {
      return true; // IFramed
    }
    return false;
  }
  setStateParams() {
    if (window.history.length < this._curHistoryLength) {
      this._historyHandicap += this._curHistoryLength - window.history.length + 1;
    } else if (window.history.length === this._curHistoryLength) {
      this._historyHandicap += 1;
    }
    this._curHistoryLength = window.history.length;
  }
  getStateParams() {
    let state: any = {};
    state.id = this._curHistoryLength + this._historyHandicap;
    return state;
  }


  // Proxy functions to RolePermissions
  canCreate(component_id: number, perms?: UserPermissions): boolean {
    return this._rp.canCreate(component_id, perms);
  }

  canRead(component_id: number, perms?: UserPermissions): boolean {
    return this._rp.canRead(component_id, perms);
  }

  canUpdate(component_id: number, perms?: UserPermissions): boolean {
    return this._rp.canUpdate(component_id, perms);
  }

  canDelete(component_id: number, perms?: UserPermissions): boolean {
    return this._rp.canDelete(component_id, perms);
  }

  hasPermission(component_id: number, operation_id: number, perms?: UserPermissions): boolean {
    return this._rp.hasPermission(component_id, operation_id, perms);
  }

  popup(u, w, h) {
    this.popupWindow(u, w, h);
  }

  popupWindow(u, w, h) {
    let popupwindow = window.open(u, '', 'top=10,left=10,height=' + h + ',width=' + w + ',toolbar=0,location=0,directories=0,resizable=1,status=0,menubar=0,scrollbars=1');
    popupwindow.focus();
  }

  popupTab(u) {
    window.open(u, '_blank');
  }

  transitionURL() {
    if (this._profile && this._profile.location === 'nissan') {
      return 'http://intranet.davesmithnissan.com/';
    } else {
      return 'http://intranet.usautosales.com/';
    }
  }
}
