import { Text, TextInput, View, TouchableHighlight, BackHandler, Pressable, KeyboardAvoidingView } from "react-native";
import { useState, useContext, useEffect } from 'react';
import axios from 'src/lib/axios';

import { Snackbar } from 'react-native-paper';
import { Formik } from "formik";

import { createIconSetFromIcoMoon } from '@expo/vector-icons';

import { AuthContext } from '../AuthProvider';

import cs from 'src/style/common';
import Loading from "src/components/Loading";
import { primaryColorHovered } from "@config";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";

const Icon = createIconSetFromIcoMoon(
    require('src/assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const ChangePasswordScreen = ({navigation}:any) => {
    const [loading, setLoading] = useState(false);
    const [checkedCurrent, setCheckedCurrent] = useState(false);
    const [checkedNew, setCheckedNew] = useState(false);
    const [checkedConfirm, setCheckedConfirm] = useState(false);
    const [snackbar, setSnackbar] = useState({visible:false,message:''});

    const { user, locale, darkMode }:any = useContext(AuthContext)

    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const validateFormik = (values:changePasswordData) => {
        const errors:any = {};
    
        if (!values.current) errors.current = i18n.t("enter-current-password");
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(values.current)) {
            errors.current = i18n.t("password-format");
        }
        if (!values.password) errors.password = i18n.t("enter-new-password");
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(values.password)) {
            errors.password = i18n.t("password-format");
        }
        if (!values.password_confirmation) errors.password_confirmation = i18n.t("enter-confirm-password");
        else if (values.password !== values.password_confirmation) {
            errors.password_confirmation = i18n.t("password-confirm-invalid");
        }
    
        return errors;
    };

    const handleComplete = (text:string) => {
        setLoading(false);
        setSnackbar({visible:true, message:text})
    }

    interface changePasswordData {
        current:string, 
        password:string, 
        password_confirmation:string
    };

    const changePassword = async (values:any, handleComplete:any) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.post('/api/v1/app/change/password', values)
        .then((response:any) => {
          if(response.status === 200 && response.data.success) {
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
    };
    
    const handleSubmit = async (values:changePasswordData) => {
        setLoading(true);
        changePassword(values, handleComplete);
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);

    const handleBackButtonClick = () => {
        navigation.pop();
        return true;
    }

    if(loading) return <Loading />;

    return (
        <>
            <KeyboardAvoidingView style={{height:'100%', }}>
                <Formik
                    initialValues={{ current: '', password: '', password_confirmation: '' }}
                    validate={values => validateFormik(values)}
                    onSubmit={values => handleSubmit(values)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <View style={cs.textFieldWrapper}>
                                <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("current-password")}</Text>
                                <View style={cs.textFieldBase}>
                                    <TextInput 
                                        onChangeText={handleChange('current')} 
                                        onBlur={handleBlur('current')}
                                        secureTextEntry={!checkedCurrent}
                                        value={values.current}
                                        style={darkMode ? cs.textFieldDark : cs.textFieldLight} />
                                    <Pressable onPress={() => {setCheckedCurrent(!checkedCurrent)}} style={{position:'absolute', right: 0, padding: 20,}}>
                                        <View>
                                            <Icon name={!checkedCurrent ? "visibility-on" : "visibility-off"} size={20} color={'#ffc107'} />
                                        </View>
                                    </Pressable>
                                </View>
                                {
                                    (touched.current && errors.current) ? <Text style={cs.helperText}>{errors.current}</Text> : null
                                }
                            </View>
                            <View style={cs.textFieldWrapper}>
                                <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("new-password")}</Text>
                                <View style={cs.textFieldBase}>
                                    <TextInput 
                                        onChangeText={handleChange('password')} 
                                        onBlur={handleBlur('password')}
                                        secureTextEntry={!checkedNew}
                                        value={values.password}
                                        style={darkMode ? cs.textFieldDark : cs.textFieldLight} />
                                    <Pressable onPress={() => {setCheckedNew(!checkedNew)}} style={{position:'absolute', right: 0, padding: 20,}}>
                                        <View>
                                            <Icon name={!checkedNew ? "visibility-on" : "visibility-off"} size={20} color={'#ffc107'} />
                                        </View>
                                    </Pressable>
                                </View>
                                {
                                    (touched.password && errors.password) ? <Text style={cs.helperText}>{errors.password}</Text> : null
                                }
                            </View>
                            <View style={cs.textFieldWrapper}>
                                <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("confirm-password")}</Text>
                                <View style={cs.textFieldBase}>
                                    <TextInput 
                                        onChangeText={handleChange('password_confirmation')} 
                                        onBlur={handleBlur('password_confirmation')}
                                        secureTextEntry={!checkedConfirm}
                                        value={values.password_confirmation}
                                        style={darkMode ? cs.textFieldDark : cs.textFieldLight} />
                                    
                                    <Pressable onPress={() => {setCheckedConfirm(!checkedConfirm)}} style={{position:'absolute', right: 0, padding: 20,}}>
                                        <View>
                                            <Icon name={!checkedConfirm ? "visibility-on" : "visibility-off"} size={20} color={'#ffc107'} />
                                        </View>
                                    </Pressable>
                                </View>
                                {
                                    (touched.password_confirmation && errors.password_confirmation) ? <Text style={cs.helperText}>{errors.password_confirmation}</Text> : null
                                }
                            </View>
                            <TouchableHighlight onPress={() => handleSubmit()} style={[cs.button, {margin: 10,}]} underlayColor={primaryColorHovered}>
                                <Text>{i18n.t("change")}</Text>
                            </TouchableHighlight>
                        </>
                    )}
                </Formik>
            </KeyboardAvoidingView>
            
            <Snackbar
                duration={5000}
                visible={snackbar.visible}
                style={darkMode ? cs.cardDark : cs.cardLight}
                onDismiss={() => setSnackbar({visible:false,message:''})}
                action={{
                    icon: 'close',
                    label: i18n.t('close'),
                    onPress: () => setSnackbar({visible:false,message:''}),
                }}
                >
                <Text style={{color: darkMode ? '#fff' : '#222'}}>{snackbar.message}</Text>
            </Snackbar>
        </>
    );
}

export default ChangePasswordScreen;