import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SecureModModule } from './secure-mod-module';

import { SecureModIndex } from
    './secure-mod-index/secure-mod-index';
import { SecureModSubpage } from
    './secure-mod-subpage/secure-mod-subpage';

const secureModRoutes = [
  { path: '', component: SecureModIndex },
  { path: 'subpage', component: SecureModSubpage }
];

@NgModule({
  imports: [
    SecureModModule,
    RouterModule.forChild(secureModRoutes)
  ]
})
export class SecureModRouting {}
