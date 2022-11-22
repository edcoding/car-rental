import React, { useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,signInWithEmailAndPassword,
  onAuthStateChanged, signOut, sendPasswordResetEmail,updatePassword,
  updateEmail, updateProfile 
} from "firebase/auth";
import { auth } from "../firebase_config";
import { db } from "../firebase_config";
import { useRouter } from "next/dist/client/router";


const AuthContext = React.createContext('');

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  var [loginErrMsg , setLoginErrMsg] = useState('');
  var [signUpErrMsg, setSignUpErrMsg] = useState('');
  var [updateUsernameErrMsg, setUpdateUsernameErrMsg] = useState('');

  const user =  auth.currentUser;
 

  function signup(email, password) {
 
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      if(user){
        router.push('/auth/UserDashboard');
        db.collection("users")
        .add({
          userID: user.uid,
          userEmail: email,
          userPassword: password,
        })
        .then(() => {
          // setUserEmail("");
          // setUserPassword("");
        })
        .catch((error) => {
          console.error(error);
        });
      }
      // ...
    })
    .catch((error) => {
      setSignUpErrMsg(error.message) ;
      console.log(error.message);
    });
  };

  function login(email, password) {
    signInWithEmailAndPassword(
      auth,
      email,
      password
    ).then((userCredential) => {
      // Signed in 
      const user = userCredential.user;            
    })
    .catch((error) => {
      setLoginErrMsg(error.message)
      console.log(error.message);
    });
  };

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }


  function updateUsername(name) {
    updateProfile(auth.currentUser, {
      displayName: name, 
    }).then(() => {
      console.log('Successful');
    }).catch((error) => {
      setUpdateUsernameErrMsg(error.message)
      console.log(error.message);
    });
  }

  function updateUserEmail(email) {
    return updateEmail(auth.currentUser ,email)
  }

  function updateUserPassword(password) {
    return updatePassword(auth.currentUser, password)
  }

  async function updateProfilePic(photoURL) {
    try {
      await updateProfile(auth.currentUser, {
        photoURL: photoURL
      });
      console.log('Successfully updated profile picture');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user)  => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])



  // // The user object has basic properties such as display name, email, etc.
  // const displayName = user.displayName;
  // const userEmail = user.email;
  // const photoURL = user.photoURL;
  // const emailVerified = user.emailVerified;
  // const uid = user.uid;

  const values = {
    currentUser,
    user,
    loginErrMsg,
    signUpErrMsg,
    updateUsernameErrMsg,
    login,
    signup,
    logout,
    resetPassword,
    updateProfilePic,
    updateUserEmail,
    updateUserPassword,
    updateUsername,
  }

  return (
    <AuthContext.Provider value={values}>
      {!loading && children}
    </AuthContext.Provider>
  )
}