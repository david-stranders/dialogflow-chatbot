import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DialogflowService {

  private baseURL: string = "https://api.dialogflow.com/v1/query?v=20150910";

  constructor(readonly http: HttpClient) {
  }

  public getResponse(query: string){
    const data = {
      query : query,
      lang: 'nl',
      sessionId: '12345'
    };

    return this.http
      .post<any>(`${this.baseURL}`, data)
  }
}
