import { View, StyleSheet, ScrollView, BackHandler, TouchableHighlight } from "react-native";
import { Text } from "react-native-paper";
import { useState, useContext, useEffect } from 'react';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import axios from "src/lib/axios";

import { AuthContext } from '../AuthProvider';

import { currency, currencyStylized, primaryColor, primaryColorSurfaceDark, primaryColorSurfaceLight, underlayDark, underlayLight } from "@config";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from 'src/style/common';
import Loading from 'src/components/Loading';
import CollapsibleBill from "src/components/CollapsibleBill";

const Icon = createIconSetFromIcoMoon(
    require('../../assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const BillScreen = ({navigation}:any) => {
    const { user, locale, darkMode, ownerAccess }:any = useContext(AuthContext)
    const [ loading, setLoading ] = useState(true);
    const [ data, setData ] = useState<any>(null)
    const [ error, setError ] = useState<string>('')

    const [ beebotOpen, setTransactionOpen ] = useState<boolean>(false);
    const [ categoryOpen, setCategoryOpen ] = useState<boolean>(false);

    const i18n = new I18n({"en": en,"id": id,});
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;
    
    const getData = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        await axios
        .get(`/api/v1/app/user/bills`, { params : { owner_token: ownerAccess}})
        .then((response:any) => {
            if(response.data.success) {
                setData(response.data.data)
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

        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);

    useEffect(() => {
        if(data) setLoading(false);
    }, [data]);

    const handleBackButtonClick = () => {
        navigation.pop();
        return true;
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
                {
                    data.map((item:any) => {
                        let amount = 0;
                        let paid = 0;
                        let remaining = 0;

                        item.data.map((monthlyData:any) => {
                            amount += monthlyData.total;
                            paid += monthlyData.paid;
                        });

                        remaining = amount - paid;

                        return <CollapsibleBill
                                    key={item.id} 
                                    locale={locale}
                                    item={item} 
                                    remaining={remaining} 
                                    amount={amount} 
                                    paid={paid} />;
                    })
                }
            </ScrollView>
        </View>
    );
    
}

export default BillScreen;