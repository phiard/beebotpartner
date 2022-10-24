import { Image, View, StyleSheet, Pressable, Platform, ScrollView, TouchableHighlight } from "react-native";
import { DataTable, Modal, Text } from "react-native-paper";
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { backendUrl, primaryColor, primaryColorHovered } from '@config';
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


export default function CollapsibleMemberRow(props:any) {
    const { index, row, locale, openImageModal, claimWarranty} = props;
    const [ expanded, setExpanded ] = useState(false);
    const { darkMode }:any = useContext(AuthContext)
    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    return (
        <>
            <DataTable.Row key={index} onPress={()=>{setExpanded(!expanded)}}>
                <DataTable.Cell style={{flex:1}}>
                    <Text>{row.id}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{flex:2,}}>
                    <Text style={darkMode ? cs.tableContentTextDark : cs.tableContentTextLight}>
                        {row.product_name}
                    </Text>
                </DataTable.Cell>
                <DataTable.Cell style={{justifyContent:'flex-end', flex:2,}}>
                    <Text style={{fontWeight:'500', textTransform: 'uppercase',}}>
                        {row.plate.replace(/(\d+)/g, function (_:any, num:any){return ' ' + num + ' ';})}
                    </Text>
                </DataTable.Cell>
            </DataTable.Row>
            {
                expanded ?
                (
                    <DataTable.Row style={{paddingVertical:10, paddingHorizontal: 10, flex: 1, width: '100%', backgroundColor: darkMode ? '#000' : '#fff'}}>
                        <View style={{flex:1, backgroundColor: darkMode ? '#333' : '#eee', borderRadius: 10, padding: 10,}}>
                            <View style={[cs.flexRow, {marginBottom: 5}]}>
                                <Text style={{fontWeight:'700', fontSize: 20,}}>{row.product_name}</Text>
                                <View style={{padding: 5, borderRadius:5, backgroundColor: row.active ? '#6f6' : '#f66'}}><Text style={[{fontWeight:'500', color: '#000'}]}>{row.status}</Text></View>
                            </View>
                            <View style={[{flexDirection:'row', marginBottom: 5}]}>
                                <Text style={{fontWeight:'500', fontSize: 16,}}>{row.plate.replace(/(\d+)/g, function (_:any, num:any){return ' ' + num + ' ';})}</Text>
                                <Text style={{fontWeight:'500', fontSize: 16,}}> - {row.brand}</Text>
                            </View>
                            <Text style={{marginBottom: 5,}}>{`${row.warranty_start} → ${row.warranty_end}`}</Text>
                            <Text>{row.note}</Text>

                            <View style={[cs.flexRow]}>
                                <TouchableHighlight 
                                    onPress={() => openImageModal(row.img_src)} 
                                    style={[cs.button, {backgroundColor: darkMode ? '#000' : '#fff', marginRight: 10,}]} 
                                    underlayColor={primaryColorHovered}>
                                    <Icon name="image-outline" color={darkMode ? '#eee' : '#333'} size={24}/>
                                </TouchableHighlight>
                                <TouchableHighlight 
                                    onPress={() => claimWarranty(row.id)} 
                                    style={[cs.button, {backgroundColor: darkMode ? '#000' : '#fff', flex:1,}]} 
                                    underlayColor={primaryColorHovered}>
                                    <View style={cs.flexRow}>
                                        <Icon name="tick" color={darkMode ? '#eee' : '#333'} size={24}/>
                                        <Text>{i18n.t('claim-warranty')}</Text>
                                    </View>

                                </TouchableHighlight>
                            </View>
                        </View>
                    </DataTable.Row>
                ) : null
            }
        </>
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
