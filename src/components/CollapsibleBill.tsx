import { Image, View, StyleSheet, TouchableHighlight, Alert } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { currency, currencyStylized, primaryColor, primaryColorHovered, underlayDark, underlayGray, underlayLight } from '@config';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from "src/navigation/AuthProvider";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";

const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

import cs from "src/style/common";

export default function CollapsibleBill(props:any) {
    const { locale, item, amount, paid, remaining} = props;
    const [ expanded, setExpanded ] = useState(false);
    const { darkMode }:any = useContext(AuthContext)
    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const handlePressItem = () => {
        Alert.alert(i18n.t('bill-detail-coming-soon'));
    }

    
    const BillItems = ({items}:any) => {
        return (
        <View style={{borderTopColor: underlayGray, borderTopWidth: 1,}}>
            {
                items.map((item:any) => {
                    const degree = Math.floor(Math.random() * 40) - 20;
                    return (
                    <TouchableHighlight key={item.my}onPress={()=>handlePressItem()} underlayColor={darkMode ? underlayDark : underlayLight}>
                        <View style={[cs.flexRow, {padding: 16, borderTopColor: darkMode ? underlayDark : underlayLight, borderTopWidth:1}]}>
                            <View>
                                <Text style={{fontWeight:'500', color: '#e33', marginBottom: 5}}>{`${currencyStylized} ${item.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                                <Text style={{fontWeight:'500', color: '#3e3'}}>{`${currencyStylized} ${item.paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                            </View>
                            <Text style={{fontWeight: '700'}}>{`${item.monthName} ${item.year}`}</Text>
                            {
                                item.total - item.paid <= 0 ?
                                (
                                    <View style={{opacity:0.25,zIndex:9,position:'absolute', right: 10, borderWidth: 5, borderColor: '#3e3', padding: 5, transform: [{rotateZ:`${degree}deg`}]}}>
                                        <Text style={{fontSize: 20, fontWeight: '800', textTransform:'uppercase', color:'#3e3'}}>{i18n.t('paid-stamp')}</Text>
                                    </View>
                                ) : null
                            }
                        </View>
                    </TouchableHighlight>)
                })
            }
        </View>
        );
    }

    return (
        <View style={[cs.tile, darkMode ? cs.cardDark : cs.cardLight, {padding: 0, marginBottom: 24}]}>
            <TouchableHighlight style={{borderRadius: 4}} onPress={()=>{setExpanded(!expanded)}} underlayColor={darkMode ? underlayDark : underlayLight}>
                <View style={{padding: 16, borderRadius: 4}}>
                    <Text style={[cs.tileTitle,  {paddingBottom: 15, fontSize: 24}]}>
                        {item.name}
                    </Text>
                    <View style={[cs.flexRow, {paddingBottom: 5}]}>
                        <Text style={{flex:1}}>{i18n.t('amount')}</Text>
                        
                        <View style={[cs.flexRow, {flex:1}]}>
                            <Text>{currencyStylized}</Text>
                            <Text style={{color:'#e33', fontWeight:'500'}}>{`${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                        </View>
                    </View>
                    <View style={[cs.flexRow, {paddingBottom: 5}]}>
                        <Text style={{flex:1}}>{i18n.t('paid')}</Text>

                        <View style={[cs.flexRow, {flex:1}]}>
                            <Text>{currencyStylized}</Text>
                            <Text style={{color:'#3e3', fontWeight:'500'}}>{`${paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                        </View>
                    </View>
                    <View style={[cs.flexRow, { borderTopColor: darkMode ? underlayGray : underlayLight, borderTopWidth: 1, paddingTop: 5}]}>
                        <Text style={{flex:1}}>{i18n.t('remaining')}</Text>
                        
                        <View style={[cs.flexRow, {flex:1}]}>
                            <Text>{currencyStylized}</Text>
                            <Text style={{color:'#ee3', fontWeight:'500', fontSize: 20}}>{`${remaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
            {
                expanded ?
                (
                    <BillItems items={item.data} />
                ) : null
            }
        </View>
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
