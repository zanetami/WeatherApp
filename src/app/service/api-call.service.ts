import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const API_KEY = '&APPID=d31477fd4a9f63aa64fa9c74d3530a5f';
const URL = 'http://api.openweathermap.org/data/2.5/';
const UNIT = '&units=metric'

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getData(call): Observable<any>{
    return this.httpClient.get<any>(URL + call + UNIT + API_KEY);
  }
  
}
