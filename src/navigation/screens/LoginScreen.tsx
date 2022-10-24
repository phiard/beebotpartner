import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, TouchableHighlight, ScrollView } from "react-native";
import { useState, useContext } from 'react';

import { Snackbar } from 'react-native-paper';
import { Formik } from "formik";

import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import { AuthContext } from '../AuthProvider';
import Logo from "src/components/Logo";

import cs from 'src/style/common';
import Loading from "src/components/Loading";
import { primaryColor, primaryColorHovered, secondaryColor } from "@config";

import * as Localization from 'expo-localization';

import { I18n } from 'i18n-js';
import {en, id} from "@languages";

const Icon = createIconSetFromIcoMoon(
    require('src/assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const LoginScreen = ({navigation}:any) => {
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({visible:false,message:''});
    
    const { login, locale, darkMode }:any = useContext(AuthContext)

    const i18n = new I18n({ "en": en, "id": id });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const validateFormik = (values:any) => {
        const errors:any = {};
    
        if (!values.username) errors.username = i18n.t('username-required');
        else if(values.username.length < 3) errors.username = i18n.t('username-too-short');
        if (!values.password) errors.password = i18n.t('password-required');
    
        return errors;
    };

    
    const handleComplete = (text:string) => {
        setLoading(false);
        setSnackbar({visible:true, message:text})
    }

    type loginData = {
        username:string, 
        password:string
    };
    
    const handleSubmit = async (values:loginData) => {
        setLoading(true);
        login(values, handleComplete);
    }

    const handleSettingButton = async () => {
        navigation.push(i18n.t('settings'))
    }

    if(loading) return <Loading />;

    return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
                <View style={{padding: 10, paddingTop: 50, flex:1,}}>
                    <View style={{flex:1,justifyContent: 'flex-start', alignItems: 'center', }}>
                        <Logo />
                        <Formik
                            initialValues={{ username: '', password: '' }}
                            validate={values => validateFormik(values)}
                            onSubmit={values => handleSubmit(values)}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View>
                                    <View style={cs.textFieldWrapper}>
                                        <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t('username')}</Text>
                                        <TextInput 
                                            onChangeText={handleChange('username')}
                                            onBlur={handleBlur('username')}
                                            value={values.username}
                                            style={darkMode ? cs.textFieldDark : cs.textFieldLight} />
                                        {
                                            (touched.username && errors.username) ? <Text style={cs.helperText}>{errors.username}</Text> : null
                                        }
                                    </View>
                                    <View style={cs.textFieldWrapper}>
                                        <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t('password')}</Text>
                                        <View style={cs.textFieldBase}>
                                            <TextInput 
                                                onChangeText={handleChange('password')} 
                                                onBlur={handleBlur('password')}
                                                secureTextEntry={!checked}
                                                value={values.password}
                                                style={darkMode ? cs.textFieldDark : cs.textFieldLight} />
                                            <Pressable onPress={() => {setChecked(!checked)}} style={{position:'absolute', right: 0, padding: 20,}}>
                                                <View>
                                                    <Icon name={!checked ? "visibility-on" : "visibility-off"} size={20} color={'#ffc107'} />
                                                </View>
                                            </Pressable>
                                        </View>
                                        
                                        {
                                            (touched.password && errors.password) ? <Text style={cs.helperText}>{errors.password}</Text> : null
                                        }
                                    </View>
                                    <TouchableHighlight onPress={() => handleSubmit()} style={[cs.button, {margin: 10,}]} underlayColor={primaryColorHovered}>
                                        <Text>{i18n.t('login')}</Text>
                                    </TouchableHighlight>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
            </ScrollView>
            <View style={{position:'absolute',bottom:10, right: 10}}>
                <TouchableHighlight onPress={() => handleSettingButton()} style={[cs.button, {margin: 10, padding: 10, elevation: 4}]} underlayColor={primaryColorHovered}>
                    <View style={{flexDirection:'row'}}>
                        <Icon name="cog" color={'#000'} size={28} />
                    </View>
                </TouchableHighlight>
            </View>
            <Snackbar
                duration={5000}
                visible={snackbar.visible}
                style={darkMode ? cs.cardDark : cs.cardLight}
                onDismiss={() => setSnackbar({visible:false,message:''})}
                action={{
                    label: i18n.t('close'),
                    onPress: () => {
                        setSnackbar({visible:false,message:''})
                    },
                }}
                >
                    <Text style={darkMode ? cs.textDark : cs.textLight}>{snackbar.message}</Text>
            </Snackbar>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;
