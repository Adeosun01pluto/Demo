// Define the interface for the User
export interface User {
    _id: ObjectId;
    id: string;
    __v: number;
    bio: string;
    communities: Community[];
    followers: ObjectId[];
    followings: any[]; // Change this to the actual type if you have it
    image: string;
    name: string;
    onboarded: boolean;
    threads: ObjectId[];
    username: string;
    questions: ObjectId[];
  }
  
  export interface Community {
    _id: ObjectId;
    profile: string;
    username: string;
    description: string;
    admins: any[]; // Change this to the actual type if you have it
    name: string;
    createdBy: ObjectId;
    threads: ObjectId[];
    members: any[]; // Change this to the actual type if you have it
    __v: number;
    questions: ObjectId[];
  }
  export interface Author {
    id: string;
    image: string;
    name: string;
  }
  
  export interface ObjectId {
    _id : string    
  }
  
  