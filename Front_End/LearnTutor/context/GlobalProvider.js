import React, { createContext, useContext, useState, useEffect } from 'react';

//JS file for capturing the current state of whether a user is logged in or not
//this is used to avoid having to log in again and again 


const GlobalProvider = ({ children }) => {



    //when global provider runs is get a currnet logged in user to ensure the app is in the state of a logged in user being present
   

    //stucture of the global component to be used in other pages, providing data and states that can be used
    return (
        // <GlobalContext.Provider
        //     value={{
        //         isLoggedIn,
        //         setIsLoggedIn,
        //         user,
        //         setUser,
        //         isLoading
        //     }}
        // >
        // </GlobalContext.Provider>
        {children}
    )
}

export default GlobalProvider;