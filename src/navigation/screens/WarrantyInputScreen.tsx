import { View, StyleSheet, ScrollView, Dimensions, BackHandler, ToastAndroid, Alert, Platform, TouchableHighlight, KeyboardAvoidingView, TextInput, Pressable, Image, ActivityIndicator } from "react-native";
import { Button, Modal, Portal, Text } from 'react-native-paper';
import { useState, useContext, useEffect } from 'react';
import axios from "src/lib/axios";
import { BarCodeScanner } from 'expo-barcode-scanner';

import { AuthContext } from '../AuthProvider';

import { currency, primaryColor, primaryColorHovered, primaryColorSurfaceDark, primaryColorSurfaceLight, secondaryColor, tertiaryColor, underlayDark, underlayLight } from "@config";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from 'src/style/common';
import Loading from 'src/components/Loading';
import { Formik } from "formik";
import * as ImagePicker from 'expo-image-picker';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import MemberModal from "src/components/MemberModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface inputWarrantyData {
    serial:string,
    plate:string, 
    model:string
    note:string|null
    img:string|null
    member_id:string|null
    voucher:string|null
};

const Icon = createIconSetFromIcoMoon(
    require('src/assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const WarrantyInputScreen = ({route, navigation}:any) => {
    const { user, locale, darkMode }:any = useContext(AuthContext)
    const [ loading, setLoading ] = useState(false);
    const [ qrData, setQrData ] = useState<string|null>(null);
    const [ title, setTitle ] = useState<string>('scanning');
    const [ image, setImage ] = useState<any>();
    
    const [ member, setMember ] = useState<any>(null);
    const [ memberData, setMemberData ] = useState<any>([]);
    const [ memberLoading, setMemberLoading ] = useState<boolean>(true);
    const [ visible, setVisible] = useState(false);
    
    const [ voucher, setVoucher] = useState('');
    const [ voucherValid, setVoucherValid ] = useState(false);
    const [ voucherAmount, setVoucherAmount ] = useState('');
    const [ voucherLoading, setVoucherLoading ] = useState(false);

    
    const [hasPermission, setHasPermission] = useState<any>(null);
    const [scanned, setScanned] = useState<any>(false);

    const [ chooseMemberFunction, setChooseMemberFunction ] = useState<any>();
    

    const handleBackButtonClick = () => {
        navigation.pop();
        return true;
    }

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();

        if(user.gankbeebot) getMemberData();

        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);

    const getMemberData = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.get('/api/v1/app/user/members')
        .then((response:any) => {
          if(response.status === 200) {
            if(!response.data.success) {
              alert(response.data.message);
              return null;
            }

            setMemberData(response.data.data);
            setMemberLoading(false);
          } else {
            alert(i18n.t('something-went-wrong'));
          }
        })
        .catch((error:any) => {
          console.error(error);
          alert(i18n.t('something-went-wrong'));
        })
    }

    const handleCheckVoucher = (setFieldValue:any) => {
        setVoucherLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.get(`/api/v1/app/voucher/${voucher}`)
        .then((response:any) => {
            if(response.status === 200 && response.data.valid) {
                let discountStylized = '';
                if(response.data.type == 2) {
                    discountStylized = `${response.data.amount}%`
                } else {
                    discountStylized = `${currency} ${response.data.amount.toString().split(/(?=(?:\d{3})+$)/).join(".")}`
                }
                setVoucherAmount(discountStylized);
                alert(i18n.t('voucher-valid', {data: discountStylized}));

                setFieldValue('voucher', voucher);
                setVoucherValid(true);
            } else {
                alert(response.data.message);
            }
        })
        .catch((error:any) => {
            alert(i18n.t('something-went-wrong-qr'));
            console.error(error);
        }).finally(() => setVoucherLoading(false))
    }

    const handleRemoveVoucher = (setFieldValue:any) => {
        setVoucherValid(false);
        setFieldValue('voucher', null)
    }
    
    const handleBarCodeScanned = ({ data }:any) => {
        setScanned(true);

        checkQrCode(data);
    };

    const checkQrCode = (serial:string) => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.post('/api/v1/app/qr', {serial: serial})
        .then((response:any) => {
            if(response.status === 200 && response.data.success) {
                setQrData(serial);
                alert(i18n.t('product-scanned', {data: response.data.product}));
            } else {
                setTitle(response.data.message);
                alert(response.data.message);
            }
        })
        .catch((error:any) => {
            alert(i18n.t('something-went-wrong-qr'));
            setTitle('something-went-wrong-qr');
          
            console.error(error.response);
        }).finally(() => {
            setLoading(false);
        })
    }

    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;


    const validateFormik = (values:inputWarrantyData) => {
        const errors:any = {};
    
        if (!values.model) errors.model = i18n.t("enter-model");
        
        if (!values.plate) errors.plate = i18n.t("enter-plate");

        if (!values.img) errors.img = i18n.t("enter-img");
    
        return errors;
    };

    const handleChooseMember = () => {
        setVisible(true);
    }

    const onMemberChosen = (member:any, setFieldValue:any) => {
        setVisible(false);
        setFieldValue('member_id', member.id)
        setMember(member);
    }


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
    
    const handleSubmit = async (values:inputWarrantyData) => {
        if(!values.img) return;
        
        let localUri:any = image.uri;
        let filename = image.fileName ? image.fileName : localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        const img:any = { uri: localUri, name: filename, type };
        
        const formData = new FormData();
        formData.append('serial', values.serial);
        formData.append('plate', values.plate);
        formData.append('model', values.model);
        formData.append('img_name', image.fileName || `${user.username}.jpg`)
        formData.append('img', img)
        if(values.note) formData.append('note', values.note);
        if(values.voucher) formData.append('voucher', values.voucher);
        if(values.member_id) formData.append('member_id', values.member_id);

        setLoading(true);
        inputWarranty(formData);
    }

    const inputWarranty = (fd:any) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.defaults.headers.common['Content-Type'] = "multipart/form-data";

        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`
        };

        axios.post('/api/v1/app/user/warranty/insert', fd, { headers: headers})
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
            alert(i18n.t('warranty-input-success'));
            navigation.pop();
        } else {
            alert(message);
        }
    }

    if(loading) return <Loading />

    if (hasPermission === null) {
        return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{color:'#fff', fontSize: 24}}>Requesting for camera permission</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{color:'#fff', fontSize: 24}}>No access to camera</Text></View>;
    }
    
    if(qrData) {
        return (
            <View style={{flex:1}}>
                <KeyboardAwareScrollView style={{flex:1, }}>
                    <Formik
                        initialValues={{
                            serial: qrData, 
                            plate: '', 
                            model: '', 
                            note: '',
                            img: null,
                            member_id: null,
                            voucher: null,
                        }}
                        validate={values => validateFormik(values)}
                        onSubmit={values => handleSubmit(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                            <ScrollView>
                                <View style={[cs.textFieldWrapper, {marginVertical: 0,}]}>
                                    <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("plate")}</Text>
                                    <View style={cs.textFieldBase}>
                                        <TextInput
                                            onChangeText={handleChange('plate')} 
                                            onBlur={handleBlur('plate')}
                                            value={values.plate}
                                            style={darkMode ? cs.textFieldDark : cs.textFieldLight} />
                                    </View>
                                    {
                                        (touched.plate && errors.plate) ? <Text style={cs.helperText}>{errors.plate}</Text> : null
                                    }
                                </View>
                                <View style={[cs.textFieldWrapper, {marginVertical: 0,}]}>
                                    <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("car-model")}</Text>
                                    <View style={cs.textFieldBase}>
                                        <TextInput 
                                            onChangeText={handleChange('model')} 
                                            onBlur={handleBlur('model')}
                                            value={values.model}
                                            style={darkMode ? cs.textFieldDark : cs.textFieldLight} />
                                    </View>
                                    {
                                        (touched.model && errors.model) ? <Text style={cs.helperText}>{errors.model}</Text> : null
                                    }
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
                                
                                {
                                    user.gankbeebot ?
                                    (
                                        <View style={[cs.flexRow, {alignItems:'flex-end', marginRight: 10,}]}>
                                            <View style={[cs.textFieldWrapper, {flex:1}]}>
                                                <Text style={darkMode ? cs.textFieldLabelDark : cs.textFieldLabelLight}>{i18n.t("voucher")}</Text>
                                                <View style={[cs.textFieldBase, {flexDirection:'row', width:'100%',}]}>
                                                    <TextInput 
                                                        editable={!voucherValid}
                                                        onChangeText={text => setVoucher(text)}
                                                        value={voucher}
                                                        placeholder={i18n.t('optional')}
                                                        placeholderTextColor={underlayLight}
                                                        style={[darkMode ? cs.textFieldDark : cs.textFieldLight, { borderTopRightRadius: 0, borderBottomRightRadius: 0, flex:3, minWidth: 0,height: '100%'}]} />
                                                    {
                                                        voucherValid ?
                                                        (
                                                            <TouchableHighlight 
                                                                underlayColor={primaryColorHovered}
                                                                onPress={()=>handleRemoveVoucher(setFieldValue)}
                                                                style={{backgroundColor: primaryColor, flex:1, padding: 20,borderTopRightRadius:10, borderBottomRightRadius: 10, height: '100%'}}
                                                            >
                                                                {
                                                                    voucherLoading ?
                                                                    <ActivityIndicator /> : <Text style={{textAlign:'center', color: '#333', fontWeight:'500'}}>{i18n.t('cancel')}</Text>
                                                                }
                                                            </TouchableHighlight>
                                                        ) :
                                                        (
                                                            <TouchableHighlight 
                                                                underlayColor={primaryColorHovered}
                                                                onPress={()=>handleCheckVoucher(setFieldValue)}
                                                                style={{backgroundColor: primaryColor, flex:1, padding: 20, borderTopRightRadius:10, borderBottomRightRadius: 10, height: '100%'}}
                                                            >
                                                                {
                                                                    voucherLoading ?
                                                                    <ActivityIndicator /> : <Text style={{textAlign:'center', color: '#333', fontWeight:'500'}}>{i18n.t('apply')}</Text>
                                                                }
                                                            </TouchableHighlight>
                                                        )
                                                    }
                                                </View>
                                                {
                                                    voucherValid ? <Text style={[cs.helperText, {color: '#3a3'}]}>{i18n.t('discount', {data:voucherAmount})}</Text> : null
                                                }
                                            </View>
                                        </View>
                                    ) : null
                                }
                                {
                                    user.gankbeebot ?
                                    (
                                        <View style={[cs.textFieldWrapper, {marginVertical: 0,}]}>
                                            {
                                                values.member_id ?
                                                (
                                                    <View style={[cs.button, darkMode ? cs.textFieldDark : cs.textFieldLight, {flex:1, minWidth: 0, padding: 10,}]}>
                                                        <View style={[cs.flexRow, {flex:1, justifyContent:'space-between', alignItems:'center'}]}>
                                                            <View style={{flex:1,}}>
                                                                <Text>{member.name}</Text>
                                                                <Text>{member.phone}</Text>
                                                            </View>
                                                            <TouchableHighlight 
                                                                underlayColor={primaryColorHovered}
                                                                style={{padding: 10,borderRadius:10, backgroundColor: primaryColor}}
                                                                onPress={()=>{setFieldValue('member_id',null)}} >
                                                                <Icon name="times" color={'#333'} size={24} />
                                                            </TouchableHighlight>
                                                        </View>
                                                    </View>
                                                )
                                                : (
                                                    <TouchableHighlight
                                                        onPress={()=>{handleChooseMember()}} 
                                                        underlayColor={darkMode ? underlayDark : underlayLight} 
                                                        style={[cs.button, darkMode ? cs.textFieldDark : cs.textFieldLight, {flex:1, marginRight: 5, minWidth: 0}]}
                                                        >
                                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                            {
                                                                memberLoading ?
                                                                <Loading /> :
                                                                <>
                                                                    <Icon name="user" color={darkMode ? '#fff' : '#333'} size={24} />
                                                                    <Text style={{marginLeft:10,}}>{i18n.t('select-member')}</Text>
                                                                </>
                                                            }
                                                        </View>
                                                    </TouchableHighlight>
                                                )
                                            }
                                            {
                                                memberData ? 
                                                    <MemberModal 
                                                        visible={visible} 
                                                        setVisible={setVisible} 
                                                        memberData={memberData}
                                                        locale={locale}
                                                        onMemberChosen={onMemberChosen}
                                                        setFieldValue={setFieldValue}
                                                        /> : null
                                            }
                                        </View>
                                    ) : null
                                }
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
                                            <TouchableHighlight onPress={()=>{handlePickImage(handleChange('img'))}} underlayColor={darkMode ? underlayDark : underlayLight} style={[cs.button, darkMode ? cs.textFieldDark : cs.textFieldLight, {flex:1, marginRight: 5, minWidth: 0}]}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Icon name="image-outline" color={darkMode ? '#fff' : '#333'} size={24} />
                                                    <Text style={{marginLeft:10,}}>{i18n.t('choose-image')}</Text>
                                                </View>
                                            </TouchableHighlight>
                                            <TouchableHighlight onPress={()=>{handleTakeImage(handleChange('img'))}} underlayColor={darkMode ? underlayDark : underlayLight} style={[cs.button, darkMode ? cs.textFieldDark : cs.textFieldLight, {flex:1, marginLeft: 5, minWidth: 0}]}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Icon name="camera-outline" color={darkMode ? '#fff' : '#333'} size={24} />
                                                    <Text style={{marginLeft:10,}}>{i18n.t('take-a-pic')}</Text>
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
    } else {
        return (
            <View style={{flex:1,}}>
                <View style={[styles.tile, darkMode ? cs.cardDark : cs.cardLight, { marginTop: 16}]}>
                    <Text style={{fontSize: 36,textAlign:'center',marginVertical: 0,}}>
                        {i18n.t(title, {defaultValue: title})}
                    </Text>
                </View>
                <View style={{margin: 8, borderRadius: 5, overflow: 'hidden', flex:1, marginBottom: 32, borderColor: darkMode ? underlayDark : '#fff', borderWidth: 3}}>
                    <BarCodeScanner
                        style={{flex:1,}}
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    />
                    {scanned && 
                        <Button 
                            onPress={() => setScanned(false)} 
                            icon={'refresh'}
                            style={[darkMode ? cs.cardDark : cs.cardLight, {position: 'absolute', bottom: 10, left: 10}]}
                        >
                            <Text>{i18n.t('scan-again')}</Text>
                        </Button>}
                </View>
            </View>
        );
    }
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

export default WarrantyInputScreen;