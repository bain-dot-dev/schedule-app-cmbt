export interface User {
    userid: string;
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    isLoggedIn?: boolean;
    role?: string;
    courseProgramID?: string;
  }
  