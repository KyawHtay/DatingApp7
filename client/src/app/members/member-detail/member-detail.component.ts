import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { PresenceService } from 'src/app/_services/presence.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-detail',
  standalone:true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports:[CommonModule,TabsModule,GalleryModule,TimeagoModule,MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit,OnDestroy{
  @ViewChild('memberTabs',{static:true}) memberTabs?: TabsetComponent
 
  member : Member ={} as Member;
  images: GalleryItem[]=[];
  activeTab?: TabDirective;
  messages: Message[]=[];
  user?: User;
  liked="btn-primary";

  constructor(private accountService: AccountService,
      private route: ActivatedRoute,
      private messgeService: MessagesService,
      private memberService: MembersService,
      private toastr:ToastrService,
      public presenceService:PresenceService) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
          next: user=>{
            if(user) this.user=user;

          }
        });
      }

      
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

  ngOnDestroy(): void {
    this.messgeService.StopHubConnecion();
  }

  selectTab(heading: string){
    if(this.memberTabs){
      this.memberTabs.tabs.find(x=>x.heading==heading)!.active=true;
    }

  }

  onTabActivated(data: TabDirective){
    this.activeTab =data;
    if(this.activeTab.heading==='Messages' && this.user){
      //this.loadMessages()
      this.messgeService.createHubConnection(this.user,this.member.userName)
    }
    else{
      this.messgeService.StopHubConnecion();
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
  addLike(member:Member){
    this.memberService.addLike(member.userName).subscribe({
      next: ()=>
      {
        this.toastr.success("You have liked "+ member.knownAs);
        this.liked="btn-danger";
      },
      error:()=>{
        this.memberService.removeLike(member.userName).subscribe({
          next: ()=>{
            console.log("You liked already")
            this.liked="btn-primary"
          }
        });
        
      }
    })
  }

}
