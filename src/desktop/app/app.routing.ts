import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth-guard';
import { LoginComponent } from '../components/login/login';
import { Home } from '../components/home/home';

const routes: Routes = [
  { path: '', component: LoginComponent },

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
  { path: 'home',
    children: [
      // Homepage
      { path: '', component: Home, canActivate: [AuthGuard] }
    ]
  }

];


export const routing = RouterModule.forRoot(routes);
