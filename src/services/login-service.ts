import { Injectable } from '@angular/core';

import { MadameService } from '@strictd/ng2-madame/madame-service';

@Injectable()
export class LoginService {
  madame: MadameService;
  runningLogin: boolean = false;

  constructor(
    _madame: MadameService
  ) {
    this.madame = _madame;
  }

  doLogin(username, password, component_ids = '1') {
    const sessCreate = this.madame.post('sessions/create', {username, password, component_ids}).share();

    sessCreate.subscribe(resp => {
      if (resp.status === 200 || resp.status === 201) {
        localStorage.setItem('jwt', resp.json().id_token);
      }
    },
    err => {});

    return sessCreate;
  }

  doLogoff() {
    localStorage.removeItem('jwt');
  }


}
