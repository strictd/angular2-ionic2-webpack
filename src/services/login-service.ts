import { Injectable } from '@angular/core';
import { MadameService } from '@strictd/ng2-madame/madame-service';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  madame: MadameService;
  runningLogin: boolean = false;

  constructor(
    _madame: MadameService
  ) {
    this.madame = _madame;
  }

  doLogin(username, password, component_ids = '1'): Observable<any> {
    return this.madame.post('sessions/create', {username, password, component_ids}).share();
  }

}
