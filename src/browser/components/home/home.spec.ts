import { TestBed } from '@angular/core/testing';

import { Home } from './home';
import { HeadersModule } from '../../modules/headers/headers.module';
import { JwtHelper } from 'angular2-jwt';

describe('Home Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HeadersModule ],
      declarations: [ Home ],
      providers: [{ provide: JwtHelper, useValue: true }]
    });
  });

});
