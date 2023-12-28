import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { TimeagoModule } from "ngx-timeago";
import { MemberListComponent } from '../member-list/member-list.component';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessagesService } from 'src/app/_services/messages.service';
import { Message } from 'src/app/_models/message';

@Component({
  selector: 'app-member-detail',
  standalone:true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports:[CommonModule,TabsModule,GalleryModule,TimeagoModule,MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit{
  @ViewChild('memberTabs',{static:true}) memberTabs?: TabsetComponent
  member : Member ={} as Member;
  images: GalleryItem[]=[];
  activeTab?: TabDirective;
  messages: Message[]=[]

  constructor(private memberService: MembersService,
      private route: ActivatedRoute,
      private messgeService: MessagesService) {}
      
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data=>this.member = data['member']
    })
    this.route.queryParams.subscribe({
      next: params=>{
        params['tab'] && this.selectTab(params['tab'])
      }
    });
    this.getImages();
  }

  selectTab(heading: string){
    if(this.memberTabs){
      this.memberTabs.tabs.find(x=>x.heading==heading)!.active=true;
    }

  }

  onTabActivated(data: TabDirective){
    this.activeTab =data;
    if(this.activeTab.heading==='Messages'){
      this.loadMessages()
    }

  }
  loadMessages(){
    if (this.member) {
      this.messgeService.getNessageThread(this.member.userName).subscribe({
        next: messages=>this.messages = messages
      })
   }
  }

  getImages(){
    if(!this.member) return;
    for(const photo of this.member?.photos){
      this.images.push(new ImageItem({src: photo.url,thumb: photo.url}))
    }
  }

}
