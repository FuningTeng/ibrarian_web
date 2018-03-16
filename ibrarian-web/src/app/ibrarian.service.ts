import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class IbrarianService {
  constructor(private http: Http) {
    console.log('ForceDataService Initialized...');
  }
  getForceData(): Observable<any> {
    return this.http.get('../assets/mock-data.json').map(res => res.json());
  }
}
