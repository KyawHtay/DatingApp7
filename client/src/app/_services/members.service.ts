import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';
import { UserParms } from '../_modules/Userparams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginationHeaders,getPaginatedResult } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl  = environment.apiUrl;
  members: Member[]=[];
  memberCache = new Map();
  user: User | undefined ;
  userParams: UserParms | undefined;
 
  constructor(private http:HttpClient,private accountService:AccountService) { 
    this.accountService.currentUser$.subscribe({
      next: user=>{
        if(user) {
          this.userParams = new UserParms(user);
          this.user=user;
        }
      }
    })
  }

  getUserParams(){
    return this.userParams;
  }
  setUserParams(params:UserParms){
    this.userParams =params;
  }

  resetUserParams(){
    if(this.userParams){
      this.userParams= new UserParms(this.user);
      return this.userParams;
    }
    return;
  }

  getMembers(userParms: UserParms){
    const response = this.memberCache.get(Object.values(userParms).join('-'));
    if(response) return of(response);

    let params = getPaginationHeaders(userParms.pageNumber,userParms.pageSize);

    params = params.append('minAge',userParms.minAge);
    params = params.append('maxAge',userParms.maxAge);
    params = params.append('gender',userParms.gender);
    params = params.append('ordderBy',userParms.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl+'users',params,this.http).pipe(
      map(response=>{
        this.memberCache.set(Object.values(userParms).join('-'),response);
        return response;
      })
    );
  }



  getMember(username:string){
    //console.log(this.memberCache);
    const member =[...this.memberCache.values()]
    .reduce((arr,element)=>arr.concat(element.result),[])
    .find((member:Member)=>member.userName===username)
    console.log(member);
    if(member) return of(member);

    return this.http.get<Member>(this.baseUrl+'users/'+username);
  }
  updateMember(member: Member){
   return this.http.put(this.baseUrl+'users',member).pipe(
    map(()=>{
      const index = this.members.indexOf(member);
      this.members[index] =  {...this.members[index],...member}
    })
   );
 }
  setMainPhoto(photoId: number){;
    return this.http.put(this.baseUrl+'users/set-main-photo/'+photoId,{})
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl+'users/delete-photo/'+photoId);
  }

  addLike(username:string){
    return this.http.post(this.baseUrl+'likes/'+username,{});
  }

  removeLike(username:string){
    console.log(this.baseUrl+'likes/'+username);
    return this.http.delete(this.baseUrl+'likes/'+username,{});
  }

  getLikes(predicate: string,pageNumber:number,pageSize:number)
  {
    let params = getPaginationHeaders(pageNumber,pageSize);
    params = params.append('predicate',predicate)
    return getPaginatedResult<Member[]>(this.baseUrl+'likes',params,this.http);
  }

}
