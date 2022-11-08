import { View, StyleSheet, ScrollView, BackHandler, TouchableHighlight, Modal, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useState, useContext, useEffect, useCallback } from 'react';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import axios from "src/lib/axios";
import {Picker} from '@react-native-picker/picker';

import { AuthContext } from '../AuthProvider';

import { currency, currencyStylized, primaryColor, primaryColorSurfaceDark, primaryColorSurfaceLight, underlayDark, underlayLight } from "@config";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from 'src/style/common';
import Loading from 'src/components/Loading';

const Icon = createIconSetFromIcoMoon(
    require('../../assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const CashbackScreen = ({navigation}:any) => {
    const { user, locale, darkMode, ownerAccess }:any = useContext(AuthContext)
    const [ loading, setLoading ] = useState(true);
    const [ data, setData ] = useState<any>(null)
    const [ selectedPeriod, setSelectedPeriod ] = useState<any>(null)
    const [ periodData, setPeriodData ] = useState<any>(null)
    const [ error, setError ] = useState<string>('')
    const [ totalCashback, setTotalCashback ] = useState<number>(0)
    const [ totalCategoryCashback, setTotalCategoryCashback ] = useState<number>(0)
    const [ pickerOpen, setPickerOpen ] = useState<boolean>(false)
    const [ date, setDate ] = useState(new Date());

    const [ transactionOpen, setTransactionOpen ] = useState<boolean>(false);
    const [ categoryOpen, setCategoryOpen ] = useState<boolean>(true);

    const i18n = new I18n({"en": en,"id": id,});
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const getPeriodData = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        await axios
        .get(`/api/v1/app/user/cashbackPeriods`, { params : { owner_token: ownerAccess}})
        .then((response:any) => {
            if(response.data.success) {
                setPeriodData(response.data.data);
            } else {
                setError(response.message);
            }
        })
        .catch(error => {
            console.error(error)
        }).finally(() => {
        })
    }
    
    const getData = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        await axios
        .get(`/api/v1/app/user/cashbacks`, { params : { owner_token: ownerAccess, month: selectedPeriod ? selectedPeriod : null}})
        .then((response:any) => {
            if(response.data.success) {
                const data = response.data.data;
                
                let total = 0;
                let totalCategory = 0;
                total += (parseFloat(data.cashbackMix) * 1000000);
                total += (parseFloat(data.cashbackLED) * 1000000);
                
                data.categoryData.map((item:any) => {totalCategory += item.cashback * item.count;total += item.cashback * item.count});
                
                setData(data);
                setTotalCashback(total);
                setTotalCategoryCashback(totalCategory);
            } else {
                setError(response.message);
            }
        })
        .catch(error => {
            console.error(error)
        }).finally(() => {
        })
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

        getData();
        getPeriodData();

        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);

    useEffect(() => {
        if(data && periodData) setLoading(false);
    }, [data, periodData]);

    const handleBackButtonClick = () => {
        navigation.pop();
        return true;
    }

    const handleChangePeriod = () => {
        setLoading(true);
        setPickerOpen(false);
        setData(null);
        getData();
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

    if(loading && !data) return <Loading />;

    return (
        <View style={{flex:1,}}>
            <ScrollView style={{flex:1, padding: 0,}}>
                <View style={[styles.tile, {padding: 0}]}>
                <TouchableHighlight style={{ borderRadius: 4,}} underlayColor={darkMode ? underlayDark : underlayLight} onPress={()=>{setPickerOpen(!pickerOpen)}}>
                    <View style={{padding: 16,}}>
                        <Text style={styles.tileTitle}>
                            {i18n.t('tap-to-change-period')}
                        </Text>
                        <Text style={styles.tileContent}>
                            {`${data.monthName} ${data.year}`}
                        </Text>
                    </View>
                </TouchableHighlight>
                </View>
                {pickerOpen ? (               
                    <Modal
                        visible={pickerOpen}
                        onDismiss={() => {setPickerOpen(false)}}
                        onRequestClose={() => {setPickerOpen(false)}}
                        onTouchCancel={() => {setPickerOpen(false)}}
                        hardwareAccelerated={true}
                        animationType="fade"
                        transparent={true}
                        style={{flex:1,justifyContent:'center',alignItems:'center'}}
                    >
                        <TouchableOpacity
                            onPress={() => {setPickerOpen(false)}}
                            style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'#88888888'}}
                        >
                            <TouchableOpacity activeOpacity={1} style={{width:'100%'}}>
                            <View style={[styles.tile ,{ padding: 16,}]} >
                                <Picker
                                    style={{color: darkMode ? '#fff' : '#000', backgroundColor: darkMode ? '#333' : '#eee'}}
                                    itemStyle={[darkMode ? cs.textDark : cs.textLight]}
                                    selectedValue={selectedPeriod}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setSelectedPeriod(itemValue)
                                    }>
                                        {
                                            periodData.map((period:any) => {
                                                return <Picker.Item key={period.value} label={period.label} value={period.value} />
                                            })
                                        }
                                </Picker>
                                <TouchableHighlight style={[cs.button, {borderRadius: 2}]} onPress={()=>handleChangePeriod()} underlayColor={darkMode ? underlayDark : underlayLight}>
                                    <Text style={{fontSize: 16, color: '#333', fontWeight: '600'}}>{i18n.t('change')}</Text>
                                </TouchableHighlight>
                            </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Modal>
                ) : null}


                <View style={styles.tile}>
                    <View style={cs.flexRow}>
                        <Text style={styles.tileTitle}>{i18n.t('cashback-total')}</Text>
                    </View>
                    <Text style={[styles.tileContent, {textTransform:'capitalize'}]}>{`${currencyStylized} ${totalCashback.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                </View>
                
                <View style={[styles.tile, {padding: 0}]}>
                    <TouchableHighlight style={{borderRadius: 4,}} onPress={()=>setTransactionOpen(!transactionOpen)} underlayColor={darkMode ? underlayDark : underlayLight}>
                        <View style={[cs.flexRow, {padding: 16,}]}>
                            <View style={{width:'100%'}}>
                                <Text style={styles.tileTitle}>{i18n.t('cashback-transaction')}</Text>
                                <Icon name="chevron-right" style={{transform: [{rotateZ: transactionOpen ? '270deg' : '90deg'}], top: -3, right: 0, position: 'absolute'}} size={24} color={primaryColor} />
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View style={{display: transactionOpen ? 'flex' : 'none', padding: 16,  borderTopColor: darkMode ? underlayDark : underlayLight, borderTopWidth: 1,}}>
                        <View style={{marginBottom: 16,}}>
                            <Text>{i18n.t('total-transaction-value')}</Text>
                            <Text style={[styles.tileContent, {fontSize: 20,}]}>{`${currencyStylized} ${data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                        </View>
                        <View style={{marginBottom: 16,}}>
                            <Text>{i18n.t('led-transaction-value')}</Text>
                            <Text style={[styles.tileContent, {fontSize: 20}]}>{`${currencyStylized} ${data.totalLED.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                        </View>
                        <View style={{marginBottom: 16,}}>
                            <Text>{i18n.t('led-transaction-value-left')}</Text>
                            <Text style={[styles.tileContent, {fontSize: 20}]}>{`${currencyStylized} ${data.leftLED.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                        </View>
                        <View style={{marginBottom: 16,}}>
                            <Text>{i18n.t('mix-transaction-value')}</Text>
                            <Text style={[styles.tileContent, {fontSize: 20}]}>{`${currencyStylized} ${data.totalMix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                        </View>
                        <View style={{marginBottom: 16,}}>
                            <Text>{i18n.t('mix-transaction-value-with-led')}</Text>
                            <Text style={[styles.tileContent, {fontSize: 20}]}>{`${currencyStylized} ${data.totalAfterMix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                        </View>

                        <View style={{marginBottom: 16, paddingTop: 16, borderTopColor: darkMode ? underlayDark : underlayLight, borderTopWidth: 1,}}>
                            <Text>{i18n.t('cashback-led')}</Text>
                            <Text style={[styles.tileContent, {fontSize: 20}]}>{`${currencyStylized} ${(data.cashbackLED * 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                        </View>
                        <View style={{marginBottom: 16}}>
                            <Text>{i18n.t('cashback-mix')}</Text>
                            <Text style={[styles.tileContent, {fontSize: 20}]}>{`${currencyStylized} ${(data.cashbackMix * 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                        </View>

                    </View>
                </View>
                
                <View style={[styles.tile, {padding: 0, marginBottom: 24}]}>
                    <TouchableHighlight style={{borderRadius: 4}} onPress={()=>setCategoryOpen(!categoryOpen)} underlayColor={darkMode ? underlayDark : underlayLight}>
                        <View style={[cs.flexRow, {padding: 16,}]}>
                            <View style={{width:'100%'}}>
                                <Text style={styles.tileTitle}>{i18n.t('cashback-category')}</Text>
                                <Icon name="chevron-right" style={{transform: [{rotateZ: categoryOpen ? '270deg' : '90deg'}], top: -3, right: 0, position: 'absolute'}} size={24} color={primaryColor} />
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View style={{display: categoryOpen ? 'flex' : 'none', padding: 16,  borderTopColor: darkMode ? underlayDark : underlayLight, borderTopWidth: 1,}}>
                        {
                            data.categoryData.map((category:any) => {
                                return (
                                <View style={[cs.flexRow, {paddingBottom: 5,}]} key={category.id}>
                                    <Text>{category.name}</Text>
                                    <Text style={{paddingHorizontal: 10,}}>{`${category.count} x ${currencyStylized} ${category.cashback.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                                </View>
                                );

                            })
                        }
                        <View style={cs.flexRow}>
                            <View></View>
                            <View style={{borderTopColor: darkMode ? underlayDark : underlayLight, borderTopWidth: 1, paddingHorizontal: 10, paddingTop: 5}}>
                                <Text style={{flex:1, textAlign:'right', color: primaryColor, fontWeight: '700', fontSize: 20}}>{`${currencyStylized} ${totalCategoryCashback.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
    
}

export default CashbackScreen;