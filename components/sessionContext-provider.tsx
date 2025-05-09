"use client";
import { createContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/interfaces/user";

// Set a default user object matching the User interface
const defaultUser: User = {
  userid: "",
  firstname: "",
  middlename: "",
  lastname: "",
  email: "",
  isLoggedIn: false,
  role: "",
  courseProgramID: "",
};

const userSessionContext = createContext<User>(defaultUser);

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const session: User = await response.json();
      console.log(session, "session from provider");
      setUser(session);
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <userSessionContext.Provider value={user}>
      {children}
    </userSessionContext.Provider>
  );
};

export { userSessionContext, UserProvider };
