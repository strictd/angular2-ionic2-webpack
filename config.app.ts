import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';
import { JwtHelper } from 'angular2-jwt';

export interface ProfileJWT {
  id: number;
  name: string;
  location: number;
  store: string;
  exp: number;
  iat: number;
  permissions: UserPermissions;
}

export interface RoleInfo {
  id: number;
  tag: string;
  description: string;
  updated_at: string;
  created_at: string;
}

export interface ComponentInfo {
  id: number;
  tag: string;
  description: string;
  updated_at: string;
  created_at: string;
}

export interface OperationInfo {
  id: number;
  tag: string;
  description: string;
  updated_at: string;
  created_at: string;
}

export interface PermissionInfo {
  id: number;
  role_id: number;
  component_id: number;
  operation_id: number;
  rank: number;
  updated_at: string;
  created_at: string;
}

export interface UserPermissions {
  components: ComponentPermissionList;
  component_tag?: any;
  operation_tag?: any;
  role_tag?: any;
}

export interface ComponentPermissionList {
  [index: string]: ComponentPermissions;
}

export interface ComponentPermissions {
  operations: Array<number>;
  role_id: number;
  component_tag?: string;
  role_tag?: string;
}

export interface OperationPermissions {
  [index: string]: number; // index is gadget_id
}

@Injectable()
export class ConfigApp {
  static _permissionObserver: Observer<UserPermissions>;
  static _permissionObservable = new Observable((observer: Observer<UserPermissions>) => {
   ConfigApp._permissionObserver = observer; // Assign to static RolePermissions._permissionObserver
  }).share();

  // Modified in gulpfile.js task 'configs'
  private _madameService = 'http://localhost:3080/';
  private _madameSocket = 'localhost:3080';

  private _isLoggedIn = false;
  private _profile: ProfileJWT;

  private _curHistoryLength = 0;
  private _historyHandicap = 1;

  public jwt: JwtHelper;
  private _token: string;

  constructor(_jwt: JwtHelper) {
    this.jwt = _jwt;
  }

  madameService(): string { return this._madameService; }
  madameSocket(): string { return this._madameSocket; }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get profile(): ProfileJWT {
    return this._profile;
  }
  set profile(value: ProfileJWT) {
    this._profile = value;
    // ConfigApp._permissionObserver.next(this._profile.permissions);
  }

  get permissions(): UserPermissions {
    return this.profile.permissions;
  }

  set token(value: string) {
    this._token = value;

    if (value && !this.jwt.isTokenExpired(value)) {
      this.profile = <ProfileJWT>this.jwt.decodeToken(value);
//      console.log(this.profile);
      this._isLoggedIn = true;
    } else { this._isLoggedIn = false; }
  }


//  setPermissions(permissions: UserPermissions): void {
//    this._profile.permissions = permissions;
//
//  }

//  getPermissions(): UserPermissions { return this._profile.permissions; }

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
  canCreate(component_id: number, self_id?: number[], perms?: UserPermissions): boolean {
    if ((self_id.length && self_id.indexOf(this._profile.id) > -1) &&
        this.hasPermission(component_id, 7, perms)) { return true; }
    return this.hasPermission(component_id, 2, perms);
  }

  canRead(component_id: number, self_id?: number[], perms?: UserPermissions): boolean {
    if ((self_id.length && self_id.indexOf(this._profile.id) > -1) &&
        this.hasPermission(component_id, 8, perms)) { return true; }
    return this.hasPermission(component_id, 3, perms);
  }

  canUpdate(component_id: number, self_id?: number[], perms?: UserPermissions): boolean {
    if ((self_id.length && self_id.indexOf(this._profile.id) > -1) &&
        this.hasPermission(component_id, 9, perms)) { return true; }
    return this.hasPermission(component_id, 4, perms);
  }

  canDelete(component_id: number, self_id?: number[], perms?: UserPermissions): boolean {
    if ((self_id.length && self_id.indexOf(this._profile.id)  > -1) &&
        this.hasPermission(component_id, 10, perms)) { return true; }
    return this.hasPermission(component_id, 5, perms);
  }

  hasPermission(component_id: number, operation_id: number, perms?: UserPermissions): boolean {
    if (perms === void 0) { perms = this.permissions; }

    try {
      if (perms.components[component_id].operations.indexOf(0) !== -1) { return false; }
      if (perms.components[component_id].operations.indexOf(1) !== -1) { return true; }
      if (perms.components[component_id].operations.indexOf(operation_id) !== -1) { return true; }
    } catch (e) { }

  return false;
  }

  popup(u, w, h) {
    this.popupWindow(u, w, h);
  }

  popupWindow(u, w, h) {
    const popupwindow = window.open(u, '', 'top=10,left=10,height=' + h + ',width=' + w + ',toolbar=0,location=0,directories=0,resizable=1,status=0,menubar=0,scrollbars=1');
    popupwindow.focus();
  }

  popupTab(u) {
    window.open(u, '_blank');
  }
}
