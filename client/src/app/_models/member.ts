import { Photo } from "./photo";

  export interface Member {
    id: number;
    userName: string;
    photoUrl: string;
    knownAs: string;
    age: number;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;
    lookingFor: string;
    interests: string;
    city: string;
    country: string;
    photos: Photo[];
  }