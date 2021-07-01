import { createContext, ReactNode, useEffect, useState } from "react"
import { auth, firebase } from "../services/firebase"

export const AuthContext = createContext({} as AuthContextType)

type User = {
    id: string;
    name: string;
    avatar: string
  }

type AuthContextType = {
    user: User | undefined,
    SignInWithGoogle: () => Promise<void>;
  }
  
  type AuthContextProps = {
      children: ReactNode
  }

export function AuthContextProvider(props: AuthContextProps) {

    const [user, setUser] = useState<User>()

    useEffect(() => {
      //verifica se já estava autenticado
      const unsubscribe = auth.onAuthStateChanged(user => {
        if(user) {
          const { displayName, photoURL, uid } = user
  
          if(!displayName || !photoURL) {
            throw new Error('Missing infomation from Google Account')
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
          })
        }
      })
  
      //quanto tiver um evento listener, após ele entrar em ação, se descadastrar desse metodo useEffect sempre no final
      return () => {  
        unsubscribe();
      }
    }, [])
  
    const SignInWithGoogle = async () => {
      const provider = new firebase.auth.GoogleAuthProvider()
  
      const result = await auth.signInWithPopup(provider)
  
        if(result.user) {
          const { displayName, photoURL, uid } = result.user
  
          if(!displayName || !photoURL) {
            throw new Error('Missing infomation from Google Account')
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
          })
  
        }
  
    }
  

    return(
        <AuthContext.Provider value={{ user, SignInWithGoogle  }}>
            {props.children}
        </AuthContext.Provider>
    )

}