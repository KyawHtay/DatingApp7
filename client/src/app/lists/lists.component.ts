import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit{
  members: Member[] | undefined;
  predicate='liked';
  pageNumber=1;
  pageSize=5;
  pagination: Pagination | undefined

  constructor(private memberService:MembersService) {}

  ngOnInit(): void {
  this.loadLikes();
  }

  loadLikes(){
    this.memberService.getLikes(this.predicate,this.pageNumber,this.pageSize).subscribe({
      next: response=>{
        this.members = response.result;
        this.pagination = response.pagination
      }
    })
  }
  pageChanged(event: any){
    if(this.pageNumber!==event.page)
    {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
  removeLike(userName:string){
    this.members= this.members?.filter((e,i)=>e.userName!== userName)
    console.log(userName);
    this.memberService.removeLike(userName).subscribe({
      next: _=>console.log('remove like'+userName)
    })
  }

}
