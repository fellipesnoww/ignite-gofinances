import React from 'react';
import { mocked } from 'ts-jest/utils';
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from './auth';
import { logInAsync } from 'expo-google-app-auth';



//Acessa a biblioteca, forçando que um método tenha um retorno especifico mockado
jest.mock('expo-google-app-auth');

describe('Auth Hook', () => {
    it('should be able to sign in with Google account', async () => {
        const googleMocked = mocked(logInAsync as any);

        googleMocked.mockResolvedValue({
            type: 'success',
            user: {
                id: 'any_id',
                email: 'fellipe@email.com',
                name: 'Fellipe',
                photo: 'any_photo.png'
            }
        });
    

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });        

        await act(() => result.current.signInWithGoogle());

        expect(result.current.user).toBeTruthy();
    });

    it('user should not connect if cancel authentication with Google', async () => {
        const googleMocked = mocked(logInAsync as any);

        googleMocked.mockResolvedValue({
            type: 'cancel',            
        });      

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });        

        await act(() => result.current.signInWithGoogle());

        expect(result.current.user).not.toHaveProperty('id');
    });
    
});