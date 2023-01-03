import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoadDataService {

  constructor(private http: HttpClient) { }

  getMembers()
  {
    return this.http.get('https://data.parliament.scot/api/members');
  }
}
