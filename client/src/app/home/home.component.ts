import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  regsiterMode= false;
  users:any;

  constructor() {}
  ngOnInit(): void {

  }

  registerToggle(){
    this.regsiterMode = !this.regsiterMode;
  }



  cancelRegisterMode(event:boolean){
    console.log("cancel register!")
    this.regsiterMode = event;
  }

}
