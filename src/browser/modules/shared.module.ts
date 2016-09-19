import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SetFocusDirective } from '@strictd/ng2-set-focus/set-focus';

import { ModalModule } from 'ng2-modal';

import { HeadersModule } from './headers/headers.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    ModalModule,
    HeadersModule
  ],
  declarations: [
    SetFocusDirective
  ],
  exports: [
    SetFocusDirective,
    ModalModule,
    HeadersModule
  ]
})
export class SharedModule {}
