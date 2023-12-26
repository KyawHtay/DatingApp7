import { User } from "../_models/user";

export class UserParms{
    gender: string;
    minAge= 18;
    maxAge=99;
    pageNumber=1;
    pageSize=3;
    orderBy='lastActive'

    constructor(user?: User) {
        this.gender = user?.gender==='female'? 'male' : 'female';
    }

}