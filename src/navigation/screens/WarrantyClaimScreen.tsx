import { View, StyleSheet, ScrollView, BackHandler, TextInput, Pressable, Image, TouchableHighlight, Alert } from "react-native";
import { Button, Modal, Portal, Text } from 'react-native-paper';
import { useState, useContext, useEffect } from 'react';
import axios from "src/lib/axios";
import { BarCodeScanner } from 'expo-barcode-scanner';

import { AuthContext } from '../AuthProvider';

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from 'src/style/common';
import Loading from 'src/components/Loading';
import { Formik } from "formik";
import * as ImagePicker from 'expo-image-picker';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { primaryColor, primaryColorHovered, underlayDark, underlayLight } from "@config";

interface warrantyClaimData {
    id:number
    note:string|null
    img:string|null
};

type warrantyData = {
    qr_id:string
    id:number
    product_name:string
    plate:string
    installer:string
    note:string
    img:string
};


const Icon = createIconSetFromIcoMoon(
    require('src/assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);
type param = {
    warrantyId:number
}

const WarrantyClaimScreen = (props:any) => {
    const { user, locale, darkMode }:any = useContext(AuthContext)
    const [ loading, setLoading ] = useState(true);
    const [ warranty, setWarranty ] = useState<warrantyData|null>(null);
    const { route, navigation} = props;
    const [ image, setImage] = useState<any>()
    
    const { warrantyId }:param = route.params;

    const handleBackButtonClick = () => {
        navigation.pop();
        return true;
    }

    const getData = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        await axios
        .get(`/api/v1/app/user/warranty/${warrantyId}`)
        .then(response => {
            setWarranty(response.data.data);
        })
        .catch(error => {
            alert(i18n.t('something-went-wrong'))
            console.error(error.response)
        }).finally(() => {
        })
    };

    useEffect(() => {
        if(warranty) setLoading(false);
    }, [warranty])
    

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

        getData();

        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);

    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;


    const validateFormik = (values:warrantyClaimData) => {
        const errors:any = {};
    
        if (!values.img) errors.img = i18n.t("enter-img");
    
        return errors;
    };

    const handlePickImage = async (handleChange:any) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        })
        if (!result.cancelled) {
            handleChange(result.uri)
            setImage(result);
        }
    }
    const handleTakeImage = async (handleChange:any) => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        })
        if (!result.cancelled) {
            handleChange(result.uri)
            setImage(result);
        }
    }
    
    const handleSubmit = async (values:warrantyClaimData) => {
        if(!warranty || !image) return;

        setLoading(true);
        
        let localUri:any = image.uri;
        let filename = image.fileName ? image.fileName : localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        const img:any = { uri: localUri, name: filename, type };
        
        const formData = new FormData()
        formData.append('qr_id', warranty.qr_id)
        formData.append('img', img)
        formData.append('img_name', image.fileName || `${user.username}.jpg`)
        if(values.note) formData.append('note', values.note);

        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.defaults.headers.common['Content-Type'] = "multipart/form-data";

        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`
        };

        axios.post('/api/v1/app/user/warranty/claim', formData, { headers: headers})
        .then((response:any) => {
          if(response.status === 200 && response.data.success) {
            handleComplete(true, null)
          } else {
            handleComplete(false, response.data.message);
          }
        })
        .catch((error:any) => {
          if(error && error.response && error.response.data && error.response.data.message) {
            handleComplete(false, error.response.data.message);
          } else {
            handleComplete(false, null);
          }
          console.error(error);
          console.error(error.response);
        })
    }

    const handleComplete = (success:boolean, message:any) => {
        if(success) {
            alert(i18n.t('warranty-claim-success'));
            navigation.pop();
        } else {
            alert(message);
        }
    }

    if(loading) return <Loading />;
    
    if(warranty) {
        return (
            <View style={{flex:1}}>
                <KeyboardAwareScrollView style={{flex:1, }}>
                    <Formik
                        initialValues={{
                            id: warrantyId,
                            note: '',
                            img: null,
                        }}
                        validate={values => validateFormik(values)}
                        onSubmit={values => handleSubmit(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <ScrollView>
                                <View style={[cs.textFieldWrapper, , {marginVertical: 0,}]}>
                                    <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("product-name")}</Text>
                                    <View style={cs.textFieldBase}>
                                        <TextInput
                                            value={warranty.product_name}
                                            style={darkMode ? cs.textFieldDark : cs.textFieldLight}
                                            editable={false}
                                            focusable={false}
                                            />
                                    </View>
                                </View>
                                <View style={[cs.textFieldWrapper, , {marginVertical: 0,}]}>
                                    <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("plate")}</Text>
                                    <View style={cs.textFieldBase}>
                                        <TextInput
                                            value={warranty.plate.replace(/(\d+)/g, function (_:any, num:any){return ' ' + num + ' ';})}
                                            style={darkMode ? cs.textFieldDark : cs.textFieldLight}
                                            editable={false}
                                            focusable={false}
                                            />
                                    </View>
                                </View>
                                <View style={[cs.textFieldWrapper, {marginVertical: 0,} ]}>
                                    <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("installer")}</Text>
                                    <View style={cs.textFieldBase}>
                                        <TextInput
                                            value={warranty.installer}
                                            style={darkMode ? cs.textFieldDark : cs.textFieldLight}
                                            editable={false}
                                            focusable={false}
                                            />
                                    </View>
                                </View>
                                <View style={[cs.textFieldWrapper, {marginVertical: 0,}]}>
                                    <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("note")}</Text>
                                    <View style={cs.textFieldBase}>
                                        <TextInput 
                                            multiline={true}
                                            onChangeText={handleChange('note')} 
                                            onBlur={handleBlur('note')}
                                            value={values.note}
                                            style={[darkMode ? cs.textFieldDark : cs.textFieldLight, {height: 150}]} />
                                    </View>
                                    {
                                        (touched.note && errors.note) ? <Text style={cs.helperText}>{errors.note}</Text> : null
                                    }
                                </View>
                                <View style={[cs.textFieldWrapper, {marginVertical: 0,}]}>
                                    <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("installation-pic")}</Text>
                                    
                                    <View style={{justifyContent:'center', alignItems:'center'}}>
                                        <Pressable onPress={()=>{handlePickImage(handleChange('img'))}}>
                                            {
                                                values.img ?
                                                <Image source={!values.img ? require('src/assets/placeholder.png') : {uri:values.img}} style={{width:'100%', aspectRatio:1, borderRadius: 10}} />
                                                : (<View style={[{width:'100%', aspectRatio: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}, darkMode ? cs.textFieldDark : cs.textFieldLight]}>
                                                    <Icon name="camera" size={96} color={primaryColor} />
                                                </View>)
                                            }
                                        </Pressable>
                                        <View style={[cs.flexRow, {marginTop:-10}]}>
                                            <TouchableHighlight 
                                                onPress={()=>{handlePickImage(handleChange('img'))}} 
                                                underlayColor={darkMode ? underlayDark : underlayLight} 
                                                style={[cs.button, darkMode ? cs.textFieldDark : cs.textFieldLight, {flex:1, marginRight: 5, minWidth: 0}]}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Icon name="image-outline" color={darkMode ? '#fff' : '#333'} size={24} />
                                                    <Text style={{marginLeft:5,}}>{i18n.t('choose-image')}</Text>
                                                </View>
                                            </TouchableHighlight>
                                            <TouchableHighlight 
                                                onPress={()=>{handleTakeImage(handleChange('img'))}} 
                                                underlayColor={darkMode ? underlayDark : underlayLight} 
                                                style={[cs.button, darkMode ? cs.textFieldDark : cs.textFieldLight, {flex:1, marginLeft: 5, minWidth: 0}]}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Icon name="camera-outline" color={darkMode ? '#fff' : '#333'} size={24} />
                                                    <Text style={{marginLeft:5,}}>{i18n.t('take-a-pic')}</Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                    {
                                        (touched.img && errors.img) ? <Text style={cs.helperText}>{errors.img}</Text> : null
                                    }
                                </View>
    
                                
    
                                <TouchableHighlight onPress={() => handleSubmit()} style={[cs.button, {margin: 10,}]} underlayColor={primaryColorHovered}>
                                    <Text style={cs.textLight}>{i18n.t("submit")}</Text>
                                </TouchableHighlight>
                            </ScrollView>
                        )}
                    </Formik>
                </KeyboardAwareScrollView>
            </View>
        )
    }

    return null;
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: primaryColor,
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
    textButton: {
        color: primaryColor,
        fontWeight: 'bold',
    },
    tile: {
        padding: 16,
        margin: 8,
        shadowColor: '#888',
        borderRadius: 4,
    },
    tileTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    tileSubtitle: {
        fontWeight: '500',
    },
    tileContent: {
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 36,
        textTransform: 'uppercase',
        color: '#f59e0b',
    },
    
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        bottom: 0,
        left:0,
        margin: 0,
        position:'absolute',
    },
    modalView: {
        flexDirection: 'column',
        backgroundColor: "#fff",
        shadowColor: "#333",
        width: '100%',
        display:'flex',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        shadowOffset: {
            height: 2,
            width: 2,
        },
    },
    buttonClose: {
        padding: 15,
        position: 'absolute',
        elevation: 2,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: primaryColor,
        aspectRatio: 1,
        height: 75,
        top: 0,
        right: 0,
    },
});

export default WarrantyClaimScreen;