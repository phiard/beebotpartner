import { Text, View, StyleSheet, Share, TouchableHighlight, ScrollView, Dimensions } from "react-native";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { currency, primaryColor, primaryColorSurfaceDark, primaryColorSurfaceLight, secondaryColor, tertiaryColor, underlayDark, underlayLight } from "@config";
import Loading from "src/components/Loading";
import axios from "src/lib/axios";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from "src/style/common";
import CampaignsTable from "src/components/CampaignsTable";

const Icon = createIconSetFromIcoMoon(
    require('src/assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const DashboardScreen = ({navigation}:any) => {
    const [ loading, setLoading ] = useState(true);
    const { user, getUser, locale, darkMode }:any = useContext(AuthContext)

    const i18n = new I18n({ "en": en, "id": id });
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const handleSettingsButton = () => { navigation.push(i18n.t('settings-screen')) }
    const handleWarrantyInputButton = () => { navigation.push(i18n.t('warranty-input-screen')) }
    const handleWarrantyHistoryButton = () => { navigation.push(i18n.t('warranty-history-screen')) }
    const handleWarrantyClaimButton = () => { navigation.push(i18n.t('warranty-claim-list-screen')) }
    
    useEffect(() => {
        getUser();
    }, []);


    useEffect(() => {
        if(user) {
            setLoading(false);
        }
    }, [user]);

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
            backgroundColor: darkMode ? primaryColorSurfaceDark : primaryColorSurfaceLight,
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
            backgroundColor: darkMode ? '#222' : '#fff',
            shadowColor: '#888',
            borderRadius: 4,
        },
        tileTitle: {
            fontWeight: 'bold',
            fontSize: 16,
            color: darkMode ? '#fff' : '#222'
        },
        tileSubtitle: {
            fontWeight: '500',
            color: darkMode ? '#ddd' : '#333'
        },
        tileContent: {
            marginTop: 8,
            fontWeight: 'bold',
            fontSize: 36,
            textTransform: 'uppercase',
            color: '#f59e0b',
        },
    });

    if(loading) return <Loading />

    return (
        <>
        <ScrollView>
            <View style={[styles.tile, {marginTop: 16}]}>
                <View style={cs.flexRow}>
                    <Text style={styles.tileTitle}>{i18n.t('welcome')}</Text>
                </View>
                <Text style={styles.tileContent}>{user.username}</Text>
            </View>
            
            <ScrollView
                horizontal={true}
                decelerationRate={0}
                snapToInterval={200} //your element width
                snapToAlignment={"center"}
                style={{paddingVertical: 8,}}>
                <TouchableHighlight style={[styles.tile, {marginVertical: 0, minWidth:'30%',}]} underlayColor={darkMode ? underlayDark : underlayLight} onPress={()=>{handleWarrantyInputButton()}}>
                    <>
                        <View style={[cs.flexRow, { marginBottom: 16,}]}>
                            <Text style={styles.tileTitle}>{i18n.t('warranty-scan')}</Text>
                        </View>
                        <Icon name="qr_code_scanner" size={48} color={primaryColor} />
                    </>
                </TouchableHighlight>
                <TouchableHighlight 
                    style={[styles.tile, {marginVertical: 0, minWidth:'30%',}]} 
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
                    style={[styles.tile, {marginVertical: 0, minWidth:'30%', marginRight: 100,}]} 
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

            <TouchableHighlight style={styles.tile} underlayColor={darkMode ? underlayDark : underlayLight} onPress={()=>{handleSettingsButton()}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={styles.tileTitle}>{i18n.t('settings')}</Text>
                    <Icon name="chevron-right" color={"#333"}/>
                </View>
            </TouchableHighlight>
        </ScrollView>
        </>
    )
}

export default DashboardScreen;
