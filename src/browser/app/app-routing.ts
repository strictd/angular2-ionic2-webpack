import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth-guard';
import { Login } from '../components/login/login';
import { Home } from '../components/home/home';
import { SecureModIndex } from
    '../modules/secure-mod/secure-mod-index/secure-mod-index';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },

/*
  // Admin Sections
  { path: 'admin', canActivate: [AuthGuard],
    loadChildren: () => new Promise(resolve => {
      return (require as any).ensure([], (require: any) => {
        return resolve(require('../admin/admin.routing').AdminRouting);
      });
    })
  }
*/
  { path: 'secure',
    children: [
      // Secure Info
      { path: '', component: SecureModIndex, canActivate: [AuthGuard] }
    ]
  }

];


export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes);
