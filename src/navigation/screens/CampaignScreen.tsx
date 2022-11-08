import { Text, View, StyleSheet, ScrollView, Dimensions, BackHandler, ToastAndroid, Alert, Platform } from "react-native";
import { useState, useContext, useEffect } from 'react';
import axios from "src/lib/axios";
import { BarChart, LineChart } from "react-native-chart-kit";

import { AuthContext } from '../AuthProvider';

import { currency, primaryColor, primaryColorHovered, primaryColorSurfaceDark, primaryColorSurfaceLight, secondaryColor, tertiaryColor } from "@config";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from 'src/style/common';
import Loading from 'src/components/Loading';
import { IconButton } from "react-native-paper";
import * as Clipboard from 'expo-clipboard';


const CampaignScreen = ({route, navigation}:any) => {
    const { user, locale, darkMode }:any = useContext(AuthContext)
    const [ loading, setLoading ] = useState(true);
    const [ campaign, setCampaign ] = useState<any>(null)

    const { campaignId } = route.params;

    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    
    const getCampaign = async (campaignId:any) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        await axios
        .get(`/api/v1/ba/campaign/${campaignId}`)
        .then(response => {
            setCampaign(response.data);
        })
        .catch(error => {
            console.error(error.response)
        }).finally(() => {
        })
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

        getCampaign(campaignId);

        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);

    useEffect(() => {
        if(campaign) {
            setLoading(false);
        }
    }, [campaign]);

    const handleBackButtonClick = () => {
        navigation.pop();
        return true;
    }

    const handleCopy = () => {
        Clipboard.setString(campaign.code);
        const msg = i18n.t("code-copied");
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            Alert.alert(msg);
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

    if(loading && !campaign) return <Loading />;

    return (
        <View style={{flex:1,}}>
            <ScrollView style={{flex:1, padding: 0}}>
                
                <View style={styles.tile}>
                    <View style={cs.flexRow}>
                        <Text style={styles.tileTitle}>{i18n.t('campaign-name')}</Text>
                    </View>
                    <Text style={styles.tileContent}>{campaign.name}</Text>
                </View>
                
                <View style={styles.tile}>
                    <Text style={styles.tileTitle}>{i18n.t('code')}</Text>
                    <Text style={styles.tileContent} selectable={true}>{campaign.code}</Text>
                    <IconButton 
                        icon={"content-copy"} 
                        mode={'contained-tonal'}
                        iconColor={'#fff'}
                        containerColor={primaryColor} 
                        underlayColor={tertiaryColor}
                        onPress={()=>{handleCopy()}}
                        style={{position:'absolute', top: 5, right: 5}}
                        size={16} />
                </View>

                <View style={styles.tile}>
                    <View style={cs.flexRow}>
                        <Text style={styles.tileTitle}>{i18n.t('amount')}</Text>
                    </View>
                    <Text style={styles.tileContent}>{campaign.type == 2 ? `${campaign.amount}%` : currency + " " + (campaign.amount+"").split(/(?=(?:\d{3})+$)/).join(".")}</Text>
                </View>
                
                <View style={cs.flexRow}>
                    <View style={[styles.tile, {flex:1}]}>
                        <View style={cs.flexRow}>
                            <Text style={styles.tileTitle}>{i18n.t('quota')}</Text>
                        </View>
                        <Text style={styles.tileContent}>{campaign.quota}</Text>
                    </View>
                    <View style={[styles.tile, {flex:1}]}>
                        <View style={cs.flexRow}>
                            <Text style={styles.tileTitle}>{i18n.t('left')}</Text>
                        </View>
                        <Text style={styles.tileContent}>{campaign.left}</Text>
                    </View>
                </View>

                <View style={styles.tile}>
                    <View style={cs.flexRow}>
                        <Text style={styles.tileTitle}>{i18n.t('comission-per-transaction')}</Text>
                    </View>
                    <Text style={styles.tileContent}>{currency + " " + (campaign.comission+"").split(/(?=(?:\d{3})+$)/).join(".")}</Text>
                </View>

                <View style={styles.tile}>
                    <View style={cs.flexRow}>
                        <Text style={styles.tileTitle}>{i18n.t('comission-earned')}</Text>
                    </View>
                    <Text style={styles.tileContent}>{currency + " " + ((campaign.used * campaign.comission)+"").split(/(?=(?:\d{3})+$)/).join(".")}</Text>
                </View>

                <View style={styles.tile}>
                    <View style={cs.flexRow}>
                        <Text style={styles.tileTitle}>{i18n.t('campaign-duration')}</Text>
                    </View>
                    <Text style={[styles.tileContent, {fontSize: 20}]}>{`${campaign.start_date} → ${campaign.end_date}`}</Text>
                </View>
                
                <View style={styles.tile}>
                    <View style={cs.flexRow}>
                        <Text style={styles.tileTitle}>{i18n.t('status')}</Text>
                        <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: campaign.status_code ? '#3f3' : '#f33'}} />
                    </View>
                    <Text style={[styles.tileContent, {fontSize: 20}]}>{campaign.status}</Text>
                </View>

                <View style={[styles.tile, {marginBottom: 30}]}>
                    <Text style={[styles.tileTitle, {marginBottom: 20,}]}>{i18n.t('voucher-usage-graph')}</Text>
                    {
                        campaign.chart.data.length > 1 ?
                        (
                            
                        <ScrollView horizontal={true}>
                            <View style={{marginVertical: 8}}>
                                <LineChart
                                    data={{
                                    labels: campaign.chart.label,
                                    datasets: [
                                        {
                                            data: campaign.chart.data
                                        }
                                    ]
                                    }}
                                    width={campaign.chart.data.length > 6 ? 
                                        ((Dimensions.get("window").width/6)*campaign.chart.data.length) : 
                                        (Dimensions.get("window").width-20)} // from react-native
                                    height={220}
                                    yAxisLabel=""
                                    yAxisSuffix="x"
                                    yAxisInterval={1} // optional, defaults to 1
                                    fromZero={true}
                                    withInnerLines={true}
                                    segments={campaign.chart.data.length < 4 ? campaign.chart.data.length : 4}
                                    bezier
                                    chartConfig={{
                                        backgroundColor: darkMode ? '#222' : '#fff',
                                        backgroundGradientFrom: darkMode ? '#222' : '#fff',
                                        backgroundGradientTo: darkMode ? '#222' : '#fff',
                                        decimalPlaces: 0, // optional, defaults to 2dp
                                        color: (opacity = 1) => primaryColor,
                                        labelColor: (opacity = 1) => darkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                                        propsForDots: {
                                            r: "6",
                                            strokeWidth: "2",
                                            stroke: secondaryColor
                                        }
                                        }}
                                        style={{
                                            borderRadius: 5,
                                    }}
                                />
                            </View>
                        </ScrollView>    
                        ) : (<Text style={darkMode ? cs.tableContentTextDark : cs.tableContentTextLight}>{i18n.t('data-not-enough')}</Text>)
                    }
                </View>
            </ScrollView>
        </View>
    );
    
}

export default CampaignScreen;