import { Text, View, StyleSheet, TextInput, Modal, TouchableHighlight, TouchableOpacity } from "react-native";
import { primaryColor, primaryColorHovered } from '@config';
import { useContext } from 'react';
import { AuthContext } from "src/navigation/AuthProvider";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";

import cs from "src/style/common";
import { Formik } from "formik";

interface pinData {
    pin:string,
};

export default function PinModal(props:any) {
    const {visible, setVisible, locale, onPinEntered, createPin} = props;
    const { darkMode }:any = useContext(AuthContext)
    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    const validateFormik = (values:pinData) => {
        const errors:any = {};
    
        if (!values.pin) errors.pin = i18n.t("enter-pin");
        else if (values.pin.length != 6) errors.pin = i18n.t("format-pin");
        else if (!/^\d+$/.test(values.pin)) errors.pin = i18n.t('pin-number')
    
        return errors;
    };

    const handleSubmit = async (values:pinData) => {
        setVisible(false);
        onPinEntered(values.pin);
    }
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    return (
        <Modal 
            visible={visible}
            onDismiss={() => {setVisible(false)}}
            onRequestClose={() => {setVisible(false)}}
            onTouchCancel={() => {setVisible(false)}}
            hardwareAccelerated={true}
            animationType="fade"
            transparent={true}
            style={{flex:1,justifyContent:'center',alignItems:'center'}}
        >
        <TouchableOpacity 
            onPress={() => {setVisible(false)}}
            style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'#88888888'}}
        >
            <TouchableOpacity activeOpacity={1}>
                <View style={{padding: 10,width:'90%',backgroundColor: darkMode ? '#000' : '#fff', borderRadius: 20, borderColor: darkMode ? '#111' : '#eee', borderWidth: 3,}}>
                    <Formik
                            initialValues={{ pin: ''}}
                            validate={values => validateFormik(values)}
                            onSubmit={values => handleSubmit(values)}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <>
                                    <View style={cs.textFieldWrapper}>
                                        <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("pin")}</Text>
                                        <View style={cs.textFieldBase}>
                                            <TextInput 
                                                onChangeText={handleChange('pin')} 
                                                onBlur={handleBlur('pin')}
                                                value={values.pin}
                                                placeholderTextColor={'#888'}
                                                secureTextEntry={true}
                                                keyboardType='numeric'
                                                style={[darkMode ? cs.textFieldDark : cs.textFieldLight, { borderWidth: 2, borderColor: '#111'}]} />
                                        </View>
                                        {
                                            (touched.pin && errors.pin) ? <Text style={cs.helperText}>{errors.pin}</Text> : null
                                        }
                                        <Text style={[cs.helperText, {textAlign:'center', marginLeft: 0}]}>{i18n.t('placeholder-pin')}</Text>
                                    </View>
                                    <TouchableHighlight onPress={()=>{handleSubmit()}} style={cs.button} underlayColor={primaryColorHovered}>
                                        <Text>
                                            {createPin ? i18n.t('create-pin') : i18n.t('enter-pin')}
                                        </Text>
                                    </TouchableHighlight>
                                </>
                            )}
                    </Formik>
                </View>
            </TouchableOpacity>
        </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    imageWrapper: {
        justifyContent:'center',
        alignItems:'center',
        borderColor: '#eee',
        overflow: 'hidden',
    },
    wrapper: {
        overflow:'hidden',
    },
    itemImage: {
        aspectRatio:1,
        resizeMode: 'cover',
    },
    centeredView: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        minHeight: '100%',
        height: '100%',
    },
    scrollView: {
        paddingTop: 75,
        flexDirection: 'column',
    },
    modalView: {
        flexDirection: 'column',
        backgroundColor: "white",
        shadowColor: "#333",
        minHeight: '100%',
        height: '100%',
        flex: 1,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        shadowOffset: {
            height: 2,
            width: 2,
        },
    },
    button: {
        padding: 15,
        position: 'absolute',
        elevation: 2
    },
    buttonClose: {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: primaryColor,
        aspectRatio: 1,
        height: 75,
        top: 0,
        right: 0,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
    },
    modalHeader: {
        position: 'absolute',
        backgroundColor: '#ffffffee',
        width: '100%',
        justifyContent:'center',
        alignItems:'flex-start',
        padding: 15,
        minHeight: 75,
        height: 75,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 32,
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold'
    },
});
