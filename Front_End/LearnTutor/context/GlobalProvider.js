import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/firebase';
//JS file for capturing the current state of whether a user is logged in or not
//this is used to avoid having to log in again and again 

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {

    //the current states that are captured glabally, no matter what page
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    //when global provider runs is get a currnet logged in user to ensure the app is in the state of a logged in user being present
    useEffect(() => {
        getCurrentUser()
        .then((res) => {
          if(res) {
            setIsLoggedIn(true);
            setUser(res);
          }  else {
            setIsLoggedIn(false);
            setUser(null);
          }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setIsLoading(false);
        })
     }, [])

    //stucture of the global component to be used in other pages, providing data and states that can be used
    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;