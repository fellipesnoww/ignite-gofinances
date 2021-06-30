import React, { 
    createContext,
    ReactNode,
    useContext,
    useState
} from 'react';
import * as Google from 'expo-google-app-auth';
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
    signInWithGoogle(): Promise<void>
}

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<User>({} as User)

    async function signInWithGoogle(){
        try {
            const result = await Google.logInAsync({
                iosClientId: '286113309584-lclrjs346d4oh6den2ofd9i110p2go61.apps.googleusercontent.com',
                androidClientId: '286113309584-esoatvlqbg228bgq0u2cl0om04mee40c.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            });

            if(result.type === 'success'){
                const userLogged = {
                    id: String(result.user.id),
                    email: result.user.email!,
                    name: result.user.name!,
                    photo: result.user.photoUrl!
                };

                setUser(userLogged);
                await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged));
            }
            
        } catch (error) {
            throw new Error(error)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle
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