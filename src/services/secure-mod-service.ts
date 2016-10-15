import { Injectable } from '@angular/core';

import { MadameService, MadameQuery } from '@strictd/ng2-madame/madame-service';
import { Observable } from 'rxjs';

export interface SecureModInfo {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

@Injectable()
export class SecureModService {
  madame: MadameService;

  constructor(
    _madame: MadameService
  ) {
    this.madame = _madame;
  }

  getData(): Observable<SecureModInfo[]> {
    // return Observable.of({id: 1, firstname: 'Test', lastname: 'Account', email: 'test@account.com', phone: '555-555-1212'});

    const madameQuery: MadameQuery = {
      method: 'get',
      url: `secure`
    };
    return this.madame.queueMadame(madameQuery).map(
      res => <SecureModInfo[]>res.json()
    );


  }

}
