import { useEffect, useState, useContext } from 'react';
import { View, StatusBar } from "react-native";

import { MD3LightTheme as PaperDefaultTheme, MD3DarkTheme as PaperDarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

import { AuthContext } from './AuthProvider';

import { primaryColor, secondaryColor, tertiaryColor } from "@config";

import Loading from "src/components/Loading";

import LoginScreen from "src/navigation/screens/LoginScreen";
import SettingsScreen from "src/navigation/screens/SettingsScreen";
import DashboardScreen from "src/navigation/screens/DashboardScreen";
import ChangeLanguageScreen from "src/navigation/screens/ChangeLanguageScreen";
import ChangeThemeScreen from 'src/navigation/screens/ChangeThemeScreen';
import CampaignScreen from 'src/navigation/screens/CampaignScreen';
import DashboardBaScreen from 'src/navigation/screens/DashboardBaScreen';
import ChangePasswordScreen from "src/navigation/screens/ChangePasswordScreen";

import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import WarrantyInputScreen from './screens/WarrantyInputScreen';
import WarrantyHistoryScreen from './screens/WarrantyHistoryScreen';
import WarrantyClaimScreen from './screens/WarrantyClaimScreen';
import WarrantyClaimListScreen from './screens/WarrantyClaimListScreen';
import AccessScreen from './screens/AccessScreen';
import CashbackScreen from './screens/CashbackScreen';
import BillScreen from './screens/BillScreen';

// import * as Linking from "expo-linking";

const AccountStack = createNativeStackNavigator();

const Icon = createIconSetFromIcoMoon(
    require('src/assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

// const prefix = Linking.makeUrl(baseUrl);

const MainContainer = () => {
    // const [deepLinkData, setDeepLinkData] = useState<any>();
    const [loading, setLoading] = useState(true);
    const { 
        user, 
        setUser, 
        setLocale, 
        locale, 
        darkMode, 
        setDarkMode,
        setOwnerAccess 
    }:any = useContext(AuthContext)

    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const screens = [
        i18n.t('login-screen'),
        i18n.t('dashboard-screen'),
        i18n.t('settings-screen'),
        i18n.t('change-language-screen'),
        i18n.t('change-theme-screen'),
        i18n.t('change-password-screen'),
        i18n.t('account-screen'),
        i18n.t('campaign-screen'),
    ];

    
    useFonts({'IcoMoon': require('../assets/fonts/icomoon.ttf'),});
    // if (!fontsLoaded) return <Loading />;

    useEffect(() => {
        // check if the user is logged in or not
        SecureStore.getItemAsync('user')
        .then(userString => {
            if (userString) {
                setUser(JSON.parse(userString));
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
        })

        SecureStore.getItemAsync('locale')
        .then(locale => {
            if (locale) {
                setLocale(JSON.parse(locale));
            } else {
                setLocale('en');
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
        })

        SecureStore.getItemAsync('darkMode')
        .then(darkMode => {
            if (darkMode) {
                setDarkMode(JSON.parse(darkMode));
            } else {
                setDarkMode(1);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
        })

        SecureStore.getItemAsync('ownerAccess')
        .then(ownerAccess => {
            if (ownerAccess) {
                setOwnerAccess(JSON.parse(ownerAccess));
            } else {
                setOwnerAccess(0);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
        })
    }, []);

    const Theme = darkMode ? {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            primary: '#f59e0b',
            background: darkMode ? '#000' : '#eee',
            card: darkMode ? '#222' : '#fff',
            text: darkMode ? '#fff' : '#111',
            border: 'transparent'
        },
        dark: true,
    } : {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: '#f59e0b',
            background: darkMode ? '#000' : '#eee',
            card: darkMode ? '#222' : '#fff',
            text: darkMode ? '#fff' : '#111',
            border: 'transparent'
        },
        dark: false,
    }

    const paperTheme = darkMode ? {
        ...PaperDarkTheme,
        roundness: 2,
        version: 3,
        colors: {
          ...PaperDarkTheme.colors,
          primary: primaryColor,
          secondary: secondaryColor,
          tertiary: tertiaryColor,
        },
        
      }
    : 
    {
        ...PaperDefaultTheme,
        roundness: 2,
        version: 3,
        colors: {
          ...PaperDefaultTheme.colors,
          primary: primaryColor,
          secondary: secondaryColor,
          tertiary: tertiaryColor,
        },
      };
      
    if (loading) {
        return <Loading />
    }
    
    return (
        <PaperProvider theme={paperTheme}>
            <NavigationContainer theme={Theme}>
                <StatusBar
                    animated={true}
                    backgroundColor={primaryColor}
                    barStyle={!darkMode ? 'dark-content' : 'default'}
                    showHideTransition='slide'
                    hidden={false} />
                
                <AccountStack.Navigator
                    screenOptions={({route})=>({
                        headerShown: route.name === i18n.t('login-screen') ? false : true,
                    })}
                    >
                    {
                        user.loggedIn ? (
                                user.permission == 5 ?
                                    <AccountStack.Screen name={i18n.t('ba-dashboard-screen')} component={DashboardBaScreen} /> :
                                    <AccountStack.Screen name={i18n.t('dashboard-screen')} component={DashboardScreen} />
                            ) :
                            <AccountStack.Screen name={i18n.t('login-screen')} component={LoginScreen} />
                    }
                    <AccountStack.Screen name={i18n.t('settings-screen')} component={SettingsScreen} />
                    <AccountStack.Screen name={i18n.t('access-screen')} component={AccessScreen} />
                    <AccountStack.Screen name={i18n.t('change-language-screen')} component={ChangeLanguageScreen} />
                    <AccountStack.Screen name={i18n.t('change-theme-screen')} component={ChangeThemeScreen} />
                    <AccountStack.Screen name={i18n.t('change-password-screen')} component={ChangePasswordScreen} />
                    <AccountStack.Screen name={i18n.t('campaign-screen')} component={CampaignScreen} />
                    <AccountStack.Screen name={i18n.t('warranty-input-screen')} component={WarrantyInputScreen} />
                    <AccountStack.Screen name={i18n.t('warranty-history-screen')} component={WarrantyHistoryScreen} />
                    <AccountStack.Screen name={i18n.t('warranty-claim-screen')} component={WarrantyClaimScreen} />
                    <AccountStack.Screen name={i18n.t('warranty-claim-list-screen')} component={WarrantyClaimListScreen} />
                    <AccountStack.Screen name={i18n.t('cashback-screen')} component={CashbackScreen} />
                    <AccountStack.Screen name={i18n.t('bill-screen')} component={BillScreen} />
                    {/* <AccountStack.Screen name={i18n.t('warranties-history-screen')} component={WarrantiesHistoryScreen} /> */}
                </AccountStack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    )
}

export default MainContainer;