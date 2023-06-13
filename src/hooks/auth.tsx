import React, { 
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect
} from 'react';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';

import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({} as IAuthContexData);

interface AuthProviderProps{
    children: ReactNode
}

interface User{
    id: string;
    email: string;
    name: string;
    photo?: string;
}

interface IAuthContexData{
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;
}

function AuthProvider({ children }: AuthProviderProps){
    const userStorageKey = '@gofinances:user';
    const [user, setUser] = useState<User>({} as User);
    const [userStorageLoading, setStorageLoading] = useState(true);
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: '286113309584-lclrjs346d4oh6den2ofd9i110p2go61.apps.googleusercontent.com',
        androidClientId: '286113309584-esoatvlqbg228bgq0u2cl0om04mee40c.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        expoClientId: "286113309584-63sb6dbthkv0ecmjlgeo8e9nbln4bo6r.apps.googleusercontent.com"
    });
      
    async function signInWithGoogle(){
        try {
            const result = await promptAsync();

            if(result.type === 'success'){
                
                const response = await fetch(
                    "https://www.googleapis.com/userinfo/v2/me",
                    {
                      headers: { Authorization: `Bearer ${result.authentication?.accessToken}` },
                    }
                  );
            
                const user = await response.json();

                const userAvatar = `http://ui-avatars.com/api/?name=${user.name}&length=1`;
                const userLogged = {
                    id: String(user.id),
                    email: user.email!,
                    name: user.name!,
                    photo: user.picture ? user.picture : userAvatar
                };

                setUser(userLogged);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }
            
        } catch (error) {
            throw new Error(error)
        }
    }

    async function signInWithApple(){
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });

            if(credential){
                const name = credential.fullName!.givenName!;
                const photo = `http://ui-avatars.com/api/?name=${name}&length=1`;

                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                    photo
                };

                setUser(userLogged);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async function signOut(){
        setUser({} as User);
        await AsyncStorage.removeItem(userStorageKey);
    }

    useEffect(() => {
        async function loadStorageData(){
            const userStorage = await AsyncStorage.getItem(userStorageKey);
            
            if(userStorage){
                const userLogged = JSON.parse(userStorage) as User;
                setUser(userLogged);
            }
            setStorageLoading(false);
        }

        loadStorageData()
    },[])

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signInWithApple,
            signOut,
            userStorageLoading
        }}>
            { children }
        </AuthContext.Provider>

    )
}

function useAuth()
{
    const context = useContext(AuthContext);

    return context;
}
export { AuthProvider, useAuth}