import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUserSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUserSource.asObservable();

  constructor(private toastr: ToastrService) { }

  createHubConnection(user:User){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl+'presence',{
        accessTokenFactory:()=> user.token
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start().catch(error=>console.log(error));

      this.hubConnection.on('UserIsOnline',username=>{
        this.toastr.info(username+' has connected');
       
      });

      this.hubConnection.on('UserIsOffline',username=>{
        this.toastr.info(username+' has disconnected');
        })
    
   

      
      this.hubConnection.on('GetOnlineUsers', usernames=>{
        this.onlineUserSource.next(usernames);
        console.log(this.onlineUsers$)
        console.log(usernames)
      })
  }
  stopHubConnection(){
    this.hubConnection?.stop().catch(error=>console.log(error));
  }
}
