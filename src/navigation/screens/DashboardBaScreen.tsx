import { Text, View, StyleSheet, Share, TouchableHighlight, ScrollView, Dimensions } from "react-native";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { baseUrl, currency, primaryColor, primaryColorSurfaceDark, primaryColorSurfaceLight, secondaryColor, tertiaryColor } from "@config";
import Loading from "src/components/Loading";
import axios from "src/lib/axios";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from "src/style/common";
import CampaignsTable from "src/components/CampaignsTable";

const Icon = createIconSetFromIcoMoon(
    require('../../assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);


const DashboardBaScreen = (props:any) => {
    const { navigation } = props;
    const [ campaigns, setCampaigns ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ loadingCampaigns, setLoadingCampaigns] = useState(true);
    const [ dashboardData, setDashboardData] = useState({totalComission: 0, totalUsedVoucher: 0});
    const { user, getUser, locale, darkMode }:any = useContext(AuthContext)

    const i18n = new I18n({ "en": en, "id": id });
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const handleSettingsButton = () => { navigation.push(i18n.t('settings-screen')) }
    const handleCampaignPress = (id:number) => {
        navigation.navigate(i18n.t('campaign'), { campaignId: id})
    }

    const getDashboardDataBA = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        await axios
        .get('/api/v1/app/user/ba/dashboard')
        .then(response => {
            setDashboardData({
                totalComission:response.data.totalComission, 
                totalUsedVoucher: response.data.totalUsedVoucher
            });
        })
        .catch(error => {
            console.error(error.response)
        }).finally(() => {
        })
    };

    const getCampaigns = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        await axios
        .get('/api/v1/ba/campaigns')
        .then(response => {
            setCampaigns(response.data.data);
        })
        .catch(error => {
            console.error(error.response)
        }).finally(() => {
        })
    };
    
    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if(campaigns.length) {
            setLoadingCampaigns(false);
        }
    }, [campaigns]);

    useEffect(() => {
        if(dashboardData) {
            setLoading(false);
        }
    }, [dashboardData]);

    useEffect(() => {
        if(user) {
            getDashboardDataBA();
            getCampaigns();
            // setLoading(false);
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
            <View style={styles.tile}>
                <View style={cs.flexRow}>
                    <Text style={styles.tileTitle}>{i18n.t('welcome')}</Text>
                </View>
                <Text style={styles.tileContent}>{user.username}</Text>
            </View>

            <View style={styles.tile}>
                <View style={cs.flexRow}>
                    <Text style={styles.tileTitle}>{i18n.t('total-comission')}</Text>
                </View>
                <Text style={styles.tileContent}>{ currency + " " + (dashboardData.totalComission+"").split(/(?=(?:\d{3})+$)/).join(".")}</Text>
            </View>
            <View style={styles.tile}>
                <View style={cs.flexRow}>
                    <Text style={styles.tileTitle}>{i18n.t('total-used-voucher')}</Text>
                </View>
                <Text style={styles.tileContent}>{dashboardData.totalUsedVoucher}</Text>
            </View>

            <View style={styles.tile}>
                <Text style={styles.tileTitle}>{i18n.t('campaign-list')}</Text>
                <CampaignsTable campaigns={campaigns} loading={loadingCampaigns} locale={locale} handleCampaignPress={handleCampaignPress} />
            </View>

            <TouchableHighlight style={styles.tile} underlayColor={darkMode ? '#444' : "#e3e3e3"} onPress={()=>{handleSettingsButton()}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={styles.tileTitle}>{i18n.t('settings')}</Text>
                    <Icon name="chevron-right" color={"#333"}/>
                </View>
            </TouchableHighlight>
        </ScrollView>
        </>
    )
}

export default DashboardBaScreen;
