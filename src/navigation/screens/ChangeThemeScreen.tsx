import { useState, useContext, useEffect } from 'react';
import { Text, View, TouchableHighlight, ScrollView, BackHandler } from "react-native";
import { Snackbar } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import axios from 'src/lib/axios';

import { AuthContext } from '../AuthProvider';

import { primaryColor, primaryColorHovered } from "@config";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from 'src/style/common';

const ChangeThemeScreen = ({navigation}:any) => {
    const { locale, darkMode, setDarkMode, user }:any = useContext(AuthContext)
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({visible:false,message:''});

    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;
    
    const changeTheme = async (theme:any, handleComplete:any) => {
      if(user.loggedIn) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.post('/api/v1/app/change/theme', {theme: theme})
        .then((response:any) => {
          if(response.status === 200 && response.data.success) {
            setDarkMode(theme)
            SecureStore.setItemAsync('darkMode', JSON.stringify(theme));
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
        setDarkMode(theme)
        SecureStore.setItemAsync('darkMode', JSON.stringify(theme));
      }
    };

    const handleChange = (selectedTheme:number) => {
        changeTheme(selectedTheme, handleComplete);
    }

    const handleComplete = (success:boolean) => {
        if(success) {
            setSnackbar({visible:true, message:i18n.t('change-theme-success')});
        } else {
            setSnackbar({visible:true, message:i18n.t('change-theme-failed')});
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
        <View style={{flex:1,}}>
            <ScrollView style={{flex:1, padding: 10}}>
                <TouchableHighlight 
                    onPress={()=>{handleChange(1)}}
                    style={[cs.menu, darkMode ? cs.menuDark : cs.menuLight, darkMode ? cs.active : null, ]} 
                    underlayColor={primaryColorHovered}>
                    <Text style={darkMode ? cs.textDark : cs.textLight}>{i18n.t("dark-mode")}</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                    onPress={()=>{handleChange(0)}}
                    style={[cs.menu, darkMode ? cs.menuDark : cs.menuLight, !darkMode ? cs.active : null]} 
                    underlayColor={primaryColorHovered}>
                    <Text style={darkMode ? cs.textDark : cs.textLight}>{i18n.t("light-mode")}</Text>
                </TouchableHighlight>
                
            </ScrollView>
            <Snackbar
                duration={5000}
                visible={snackbar.visible}
                style={{backgroundColor: darkMode ? '#333' : "#fff"}}
                onDismiss={() => setSnackbar({visible:false,message:''})}
                action={{
                    icon: 'close',
                    color: '#333',
                    label: '',
                    onPress: () => {
                        setSnackbar({visible:false,message:''})
                    },
                }}
                >
                <View><Text style={{color: darkMode ? '#fff' : '#222'}}>{snackbar.message}</Text></View>
            </Snackbar>
        </View>
    );
}

export default ChangeThemeScreen;