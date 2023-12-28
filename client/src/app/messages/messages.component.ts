import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessagesService } from '../_services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements  OnInit{

messages?: Message[]=[] ;
pagination?: Pagination;
container ='Unread';
pageNumber =1;
pageSIze=5;
loading =false;

  constructor(private mesageService:MessagesService) {}
  
  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.loading=true;
    this.mesageService.getMessages(this.pageNumber,this.pageSIze,this.container).subscribe({
      next: response=>{
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading =false;
      }
    })
  }

  deleteMessage(id:number){
    this.mesageService.deletMessage(id).subscribe({
      next: ()=>this.messages?.splice(this.messages.findIndex(m=>m.id==id))
    })
  }

  pageChanged(event:any){
    if(this.pageNumber ! ==event.page){
      this.pageNumber=event.page;
      this.loadMessages();
    }
  }

}
