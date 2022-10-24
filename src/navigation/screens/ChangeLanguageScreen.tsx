import { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ScrollView, BackHandler } from "react-native";
import { Snackbar } from 'react-native-paper';
import axios from 'src/lib/axios';
import * as SecureStore from 'expo-secure-store';

import { AuthContext } from '../AuthProvider';

import { primaryColor, primaryColorHovered } from "@config";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from 'src/style/common';

const ChangeLanguageScreen = ({navigation}:any) => {
    const { locale, darkMode, user, setLocale }:any = useContext(AuthContext)
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({visible:false,message:''});

    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const changeLanguage = async (language:any, handleComplete:any) => {
      if(user.loggedIn) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.post('/api/v1/app/change/lang', {lang: language})
        .then((response:any) => {
          if(response.status === 200 && response.data.success) {
            setLocale(language);
            SecureStore.setItemAsync('locale', JSON.stringify(language));
            handleComplete(1, null)
          } else {
            handleComplete(0, response.data.message);
          }
        })
        .catch((error:any) => {
          if(error.response.data.message) {
            handleComplete(0, error.response.data.message);
          } else {
            handleComplete(0, null);
          }
          console.error(error.response);
        })
      } else {
        setLocale(language);
        SecureStore.setItemAsync('locale', JSON.stringify(language));
      }
    };

    const handleChange = (selectedLocale:string) => {
        changeLanguage(selectedLocale, handleComplete);
    }

    const handleComplete = (success:boolean) => {
        if(success) {
            setSnackbar({visible:true, message:i18n.t('change-lang-success')});
        } else {
            setSnackbar({visible:true, message:i18n.t('change-lang-failed')});
        }
        setLoading(false);
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);

    const handleBackButtonClick = () => {
        navigation.pop();
        return true;
    }

    return (
        <ScrollView style={{flex:1, padding: 10}}>
            <TouchableHighlight 
                onPress={()=>{handleChange('id')}}
                style={[cs.menu, darkMode ? cs.menuDark : cs.menuLight, locale == "id" ? cs.active : null]} 
                underlayColor={primaryColorHovered}>
                <Text style={darkMode ? cs.textDark : cs.textLight}>{i18n.t("indonesia")}</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                onPress={()=>{handleChange('en')}}
                style={[cs.menu, darkMode ? cs.menuDark : cs.menuLight, locale == "en" ? cs.active : null]} 
                underlayColor={primaryColorHovered}>
                <Text style={darkMode ? cs.textDark : cs.textLight}>{i18n.t("english")}</Text>
            </TouchableHighlight>
            
            <Snackbar
                duration={5000}
                visible={snackbar.visible}
                style={{backgroundColor: "#fff"}}
                onDismiss={() => setSnackbar({visible:false,message:''})}
                action={{
                    label: 'Close',
                    onPress: () => {
                        setSnackbar({visible:false,message:''})
                    },
                }}
                >
                <View><Text>{snackbar.message}</Text></View>
            </Snackbar>
        </ScrollView>
    );
}

export default ChangeLanguageScreen;