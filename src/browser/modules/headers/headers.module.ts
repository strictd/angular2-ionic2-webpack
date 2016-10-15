import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header';
import { NavbarComponent } from './navbar/navbar';
import { DefaultNavbar } from './navbar/default-navbar';


@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent,
    NavbarComponent,
    DefaultNavbar
  ],
  exports: [
    HeaderComponent,
    NavbarComponent,
    DefaultNavbar
  ]
})
export class HeadersModule {}
