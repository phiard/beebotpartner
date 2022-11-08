import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableHighlight, ScrollView } from "react-native";
import { Text, } from 'react-native-paper';
import { AuthContext } from '../AuthProvider';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { primaryColor, underlayDark, underlayLight } from "@config";
import Loading from "src/components/Loading";
import * as SecureStore from 'expo-secure-store';

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from "src/style/common";
import axios from 'src/lib/axios';

const Icon = createIconSetFromIcoMoon(
    require('src/assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const DashboardScreen = ({navigation}:any) => {
    const [ loading, setLoading ] = useState(true);
    const { user, getUser, locale, darkMode, ownerAccess, setOwnerAccess }:any = useContext(AuthContext)

    const i18n = new I18n({ "en": en, "id": id });
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const handleSettingsButton = () => { navigation.push(i18n.t('settings-screen')) }
    const handleWarrantyInputButton = () => { navigation.push(i18n.t('warranty-input-screen')) }
    const handleWarrantyHistoryButton = () => { navigation.push(i18n.t('warranty-history-screen')) }
    const handleWarrantyClaimButton = () => { navigation.push(i18n.t('warranty-claim-list-screen')) }
    const handleCashbackButton = () => { navigation.push(i18n.t('cashback-screen')) }
    const handleBillButton = () => { navigation.push(i18n.t('bill-screen')) }
    
    const removeOwnerAccess = async () => {
        setOwnerAccess(0);
        SecureStore.setItemAsync('ownerAccess', JSON.stringify(0));
    }
    
    const checkPinAuthenticity = async (pin:any) => {
        if(user.loggedIn) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
          axios.post('/api/v1/app/user/access/owner/check', {pin: pin})
          .then((response:any) => {
            if(response.status != 200 || !response.data.success) removeOwnerAccess();
          })
          .catch((error:any) => {
            removeOwnerAccess();
            console.error(error.response);
          }).finally(()=>{setLoading(false)});
        }
      };
  

    useEffect(() => {
        getUser();
    }, []);
    
    useEffect(() => {
        if(user) {
            if(ownerAccess) checkPinAuthenticity(ownerAccess);
            else setLoading(false);
        }
    }, [user]);

    if(loading) return <Loading />

    return (
        <>
        <ScrollView>
            <View style={[styles.tile, darkMode ? cs.cardDark : cs.cardLight, {marginTop: 16,}]}>
                <View style={cs.flexRow}>
                    <Text style={styles.tileTitle}>{i18n.t('welcome')}</Text>
                </View>
                <Text style={styles.tileContent}>{user.username}</Text>
            </View>
            
            <ScrollView
                horizontal={true}
                decelerationRate={0}
                snapToAlignment={"center"}
                style={{paddingVertical: 8, marginHorizontal: 8, width: '100%'}}>
                <TouchableHighlight style={[styles.tile, darkMode ? cs.cardDark : cs.cardLight, {marginLeft: 0,marginVertical: 0, minWidth:'30%',}]} underlayColor={darkMode ? underlayDark : underlayLight} onPress={()=>{handleWarrantyInputButton()}}>
                    <>
                        <View style={[cs.flexRow, { marginBottom: 16,}]}>
                            <Text style={styles.tileTitle}>{i18n.t('warranty-scan')}</Text>
                        </View>
                        <Icon name="qr_code_scanner" size={48} color={primaryColor} />
                    </>
                </TouchableHighlight>
                <TouchableHighlight 
                    style={[styles.tile, darkMode ? cs.cardDark : cs.cardLight, {marginVertical: 0, minWidth:'30%',}]} 
                    underlayColor={darkMode ? underlayDark : underlayLight} 
                    onPress={()=>{handleWarrantyHistoryButton()}}>
                    <>
                        <View style={[cs.flexRow, { marginBottom: 16,}]}>
                            <Text style={styles.tileTitle}>{i18n.t('warranty-history')}</Text>
                        </View>
                        <Icon name="history" size={48} color={primaryColor} />
                    </>
                </TouchableHighlight>
                <TouchableHighlight 
                    style={[styles.tile, darkMode ? cs.cardDark : cs.cardLight, {marginVertical: 0, minWidth:'30%', marginRight: 50,}]} 
                    underlayColor={darkMode ? underlayDark : underlayLight} 
                    onPress={()=>{handleWarrantyClaimButton()}}>
                    <>
                        <View style={[cs.flexRow, { marginBottom: 16,}]}>
                            <Text style={styles.tileTitle}>{i18n.t('warranty-claim')}</Text>
                        </View>
                        <Icon name="input-checked" size={48} color={primaryColor} />
                    </>
                </TouchableHighlight>
            </ScrollView>

            {
                ownerAccess ?
                (
                    <>
                        <TouchableHighlight style={[styles.tile, darkMode ? cs.cardDark : cs.cardLight, ]} underlayColor={darkMode ? underlayDark : underlayLight} onPress={()=>{handleBillButton()}}>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <View style={cs.flexRow}>
                                    <View style={{backgroundColor: primaryColor, borderRadius: 10, height: 50, width: 50, justifyContent:'center', alignItems:'center', marginRight: 10}}>
                                        <Icon name="credit-card" size={24} color={'#fff'} />
                                    </View>
                                    <Text style={[styles.tileTitle]}>{i18n.t('bill')}</Text>
                                </View>
                                <Icon name="chevron-right" color={darkMode ? '#fff' : '#000'} size={20} />
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight style={[styles.tile, darkMode ? cs.cardDark : cs.cardLight, ]} underlayColor={darkMode ? underlayDark : underlayLight} onPress={()=>{handleCashbackButton()}}>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <View style={cs.flexRow}>
                                    <View style={{backgroundColor: primaryColor, borderRadius: 10, height: 50, width: 50, justifyContent:'center', alignItems:'center', marginRight: 10}}>
                                        <Icon name="dollar" size={24} color={'#fff'} />
                                    </View>
                                    <Text style={[styles.tileTitle]}>{i18n.t('cashback')}</Text>
                                </View>
                                <Icon name="chevron-right" color={darkMode ? '#fff' : '#000'} size={20} />
                            </View>
                        </TouchableHighlight>
                    </>
                ) : null
            }

            <TouchableHighlight style={[styles.tile, darkMode ? cs.cardDark : cs.cardLight, ]} underlayColor={darkMode ? underlayDark : underlayLight} onPress={()=>{handleSettingsButton()}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <View style={cs.flexRow}>
                        <View style={{backgroundColor: primaryColor, borderRadius: 10, height: 50, width: 50, justifyContent:'center', alignItems:'center', marginRight: 10}}>
                            <Icon name="cog" size={24} color={'#fff'} />
                        </View>
                        <Text style={[styles.tileTitle]}>{i18n.t('settings')}</Text>
                    </View>
                    <Icon name="chevron-right" color={darkMode ? '#fff' : '#000'} size={20} />
                </View>
            </TouchableHighlight>
        </ScrollView>
        </>
    )
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
    textButtonWrapper: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
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
    tileContent: {
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 36,
        textTransform: 'uppercase',
        color: '#f59e0b',
    },
});

export default DashboardScreen;
