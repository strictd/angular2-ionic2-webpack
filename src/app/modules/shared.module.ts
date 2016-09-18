import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SetFocusDirective } from '@strictd/set-focus/set-focus';

import { ModalModule } from 'ng2-modal';

import { HeaderComponent } from
    '../components/header/header';
import { NavbarComponent } from
    '../components/navbar/navbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    ModalModule
  ],
  declarations: [
    HeaderComponent,
    NavbarComponent,
    SetFocusDirective
  ],
  exports: [
    HeaderComponent,
    NavbarComponent,
    SetFocusDirective,
    ModalModule
  ]
})
export class SharedModule {}
