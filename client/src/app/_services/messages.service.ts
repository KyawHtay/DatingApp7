import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getMessages(pageNumber:number,pageSize:number,container:string){
    let parms = getPaginationHeaders(pageNumber,pageSize);
    parms = parms.append('Container',container);
    return getPaginatedResult<Message[]>(this.baseUrl+'messages',parms,this.http)
  }
  getNessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl+'messages/thread/'+username);
  }
  sendMessage(username: string,content: string){
    return this.http.post<Message>(this.baseUrl+'messages',
        {recipientUsername: username,content});
  }  

  deletMessage(id:number){
    return this.http.delete(this.baseUrl+'messages/'+id);
  }
}
