"use client"

import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import React from "react";  
import { getCookieConsentValue, resetCookieConsentValue } from "react-cookie-consent";
import { QuestionData } from "@/types/home";

export interface User {
    email : string,
    name : string,
    picture : string,

    // Given name is the first name
    given_name : string,

    // Currency
    currency : number,

    // Questions answered
    questionsAnswered : QuestionData[]
}

export default function Signup() {
    function successCallback(token : CredentialResponse){
        const str : string = token.credential  || "";
        const user : User = jwtDecode<User>(str);
        if(getCookieConsentValue("userData") == "true"){
            // save
            document.cookie = JSON.stringify(user);
            window.location.replace("/");
        }
    }

    function errorCallback(){
        // TO DO : Toast system
        alert("You have to enable the cookies to signup!");
        resetCookieConsentValue();
    }

  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        {/* TO DO : Actual UI */}
        <GoogleLogin
          onSuccess={successCallback}
          onError={() => errorCallback()}
        //   useOneTap
        />
        ;
      </GoogleOAuthProvider>
    </div>
  );
}
