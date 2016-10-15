import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared.module';

import { SecureModIndex } from
    './secure-mod-index/secure-mod-index';
import { SecureModSubpage } from
    './secure-mod-subpage/secure-mod-subpage';

import { SecureModPermissions } from
    '../../../permissions/secure-mod-permissions';
import { SecureModService } from '../../../services/secure-mod-service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,
  ],
  providers: [
    SecureModPermissions,
    SecureModService
  ],
  declarations: [
    SecureModIndex,
    SecureModSubpage
  ],
  exports: [
    SecureModIndex,
    SecureModSubpage
  ]
})
export class SecureModModule {}
