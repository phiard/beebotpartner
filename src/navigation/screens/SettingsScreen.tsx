import { primaryColor, primaryColorHovered, underlayDark, underlayLight, version } from "@config";
import { Image, ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import cs from "src/style/common";
import { AuthContext } from "../AuthProvider";
import { useEffect, useContext } from 'react';
import { BackHandler } from 'react-native';

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";

const Icon = createIconSetFromIcoMoon(
    require('../../assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const SettingsScreen = (props:any) => {
    const { navigation } = props;
    const { user, getUser, logout, locale, darkMode, ownerAccess }:any = useContext(AuthContext);

    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const handleLogout = () => {
        logout().then(() => navigation.popToTop());
    }
    
    useEffect(() => {
        if(user.loggedIn) getUser();
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);

    const handleBackButtonClick = () => {
        navigation.pop();
        return true;
    }

    const underlayColor = darkMode ? underlayDark : underlayLight;
    const iconColor = darkMode ? '#ccc' : '#333';

    return (
        <View style={{display:'flex',flexDirection:'column', flex:1,}}>
            <ScrollView style={{flex:1, marginTop: 10,}}>
                <TouchableHighlight style={darkMode ? cs.tileDark : cs.tileLight} underlayColor={underlayColor} onPress={()=>{navigation.push(i18n.t('change-language-screen'))}}>
                    <View style={styles.tileButton}>
                        <Text style={darkMode ? cs.tileTextDark : cs.tileTextLight}>{i18n.t('language')}</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text style={{color:'#888', textTransform: 'uppercase'}}>{locale ? locale : Localization.locale}</Text>
                            <Icon name="chevron-right" color={iconColor} size={20} />
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={darkMode ? cs.tileDark : cs.tileLight} underlayColor={underlayColor} onPress={()=>{navigation.push(i18n.t('change-theme-screen'))}}>
                    <View style={styles.tileButton}>
                        <Text style={darkMode ? cs.tileTextDark : cs.tileTextLight}>{i18n.t('theme')}</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text style={{color:'#888', textTransform: 'uppercase'}}>{darkMode ? i18n.t('dark') : i18n.t('light')}</Text>
                            <Icon name="chevron-right" color={iconColor} size={20} />
                        </View>
                    </View>
                </TouchableHighlight>
                {
                    user.loggedIn ?
                    (
                        <>
                            <TouchableHighlight style={darkMode ? cs.tileDark : cs.tileLight} underlayColor={underlayColor} onPress={()=>{navigation.push(i18n.t('access-screen'))}}>
                                <View style={styles.tileButton}>
                                    <Text style={darkMode ? cs.tileTextDark : cs.tileTextLight}>{i18n.t('access')}</Text>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        {
                                            ownerAccess ? 
                                            <View style={{height: 15, width: 15, borderRadius: 5, backgroundColor: '#3c3'}}></View>
                                            : null
                                        }
                                        <Icon name="chevron-right" color={iconColor} size={20} />
                                    </View>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={darkMode ? cs.tileDark : cs.tileLight} underlayColor={underlayColor} onPress={()=>{navigation.push(i18n.t('change-password-screen'))}}>
                                <View style={styles.tileButton}>
                                    <Text style={darkMode ? cs.tileTextDark : cs.tileTextLight}>{i18n.t('change-password')}</Text>
                                        <Icon name="chevron-right" color={iconColor} size={20} />
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={[cs.button, {margin:8,}]} onPress={()=>{handleLogout()}} underlayColor={primaryColorHovered}>
                                <Text style={{fontWeight: '600',}}>{i18n.t('logout')}</Text>
                            </TouchableHighlight>
                        </>
                    ) : null
                }
            </ScrollView>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', flex:0, paddingVertical: 15}}>
                <Text style={[darkMode ? cs.textDark : cs.textLight, {textAlign:'center', flex:0,}]}>Beebot © {new Date().getFullYear()}</Text>
                <Text style={[darkMode ? cs.textDark : cs.textLight, {textAlign:'center', flex:0, marginHorizontal: 10,}]}>|</Text>
                <Text style={[darkMode ? cs.textDark : cs.textLight, {textAlign:'center', flex:0,}]}>Partner v{version}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#ffc107",
        padding: 4,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        borderRadius: 4,
    },
    buttonOutline: {
        color: "#ffc107",
        borderColor: "#ffc107",
        borderWidth: 1,
        padding: 4,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        borderRadius: 4,
    },
    flexRow: {
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems: 'center'
    },
    textButton: {
        color: primaryColor,
        fontWeight: 'bold',
    },
    tileButton: {
        padding: 16,
        flexDirection:'row', 
        justifyContent:'space-between',
        alignItems:'center'
    },
});

export default SettingsScreen;