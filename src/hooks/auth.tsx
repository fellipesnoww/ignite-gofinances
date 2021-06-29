import React, { 
    createContext,
    ReactNode,
    useContext
} from 'react';

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
}

function AuthProvider({ children }: AuthProviderProps){
    const user = {
        id: '123',
        email: 'fellipe2.0e@gmail.com',
        name: 'Fellipe Neves',            
    }

    return (
        <AuthContext.Provider value={{user}}>
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