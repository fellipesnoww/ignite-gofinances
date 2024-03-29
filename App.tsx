import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from 'react';
import AppLoading from 'expo-app-loading'
import {ThemeProvider} from 'styled-components';
import * as WebBrowser from 'expo-web-browser';

import theme from './src/global/styles/theme'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import { Routes } from './src/routes';
import { StatusBar, Platform } from 'react-native';

import { AuthProvider, useAuth } from './src/hooks/auth';

export default function App() {
  const {userStorageLoading} = useAuth();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });


  if(!fontsLoaded || userStorageLoading)
    return (
      <AppLoading />
    );
  
    WebBrowser.maybeCompleteAuthSession();

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content" />        
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
