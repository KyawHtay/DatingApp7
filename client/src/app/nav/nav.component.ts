import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
model:any ={};


  constructor(public accountService:AccountService,
      private router: Router,
      private toastr: ToastrService,
      private memberService:MembersService) {}
  ngOnInit(): void {
    console.log(this.accountService.currentUser$);
  }


  login(){
    this.accountService.login(this.model).subscribe({
      next: ()=> 
        {
          this.memberService.resetUserParams();
          this.router.navigateByUrl('/members');
        },
      error: error=> {
        console.log(error);
        this.toastr.error(error.error)
      }
    })
  }
  logout(){ 
    this,this.accountService.logout();
    this.router.navigateByUrl('/')
   
  }

}
