import { Text, Image, View, StyleSheet, Pressable, Platform, ScrollView, TextInput, Modal, TouchableHighlight, TouchableOpacity } from "react-native";
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { backendUrl, primaryColor, underlayDark, underlayLight } from '@config';
import { useState, useEffect } from 'react';
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

import { Dimensions } from 'react-native'
import Loading from "./Loading";
import cs from "src/style/common";


export default function MemberModal(props:any) {
    const {memberData, visible, setVisible, locale, onMemberChosen, setFieldValue} = props;
    const { darkMode }:any = useContext(AuthContext)
    const i18n = new I18n({
        "en": en,
        "id": id,
    });

    const [ filteredData, setFilteredData] = useState<any>();

    useEffect(() => {
      setFilteredData(memberData);
    }, [])

    const filterMember = (text:string) => {
        setFilteredData(memberData.filter((data:any) => {return data.name.toLowerCase().includes(text.toLowerCase()) || data.phone.toLowerCase().includes(text.toLowerCase());} ))
    }
    
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    if(!filteredData) return <Loading />

    return (
        <Modal 
        visible={visible}
        onDismiss={() => {setVisible(false);filterMember('');}}
        onRequestClose={() => {setVisible(false);filterMember('');}}
        onTouchCancel={() => {setVisible(false);filterMember('');}}
        hardwareAccelerated={true}
        animationType="slide"
        transparent={true}
        style={{flex:1,justifyContent:'center',alignItems:'center'}}
        >
        <TouchableOpacity 
            onPress={() => {setVisible(false);filterMember('');}}
            style={{flex:1, justifyContent:'center',alignItems:'center', margin: 10,}}
        >
            <View style={{minHeight: 500, maxHeight: 500, width:'90%',backgroundColor: darkMode ? '#333' : '#fff', borderRadius: 10, borderColor: darkMode ? '#111' : '#eee', borderWidth: 3,}}>
                    <TextInput 
                    style={[darkMode ? cs.textFieldDark : cs.textFieldLight, {borderTopLeftRadius: 10, borderTopRightRadius: 10, borderRadius:0, borderBottomWidth: 2, borderColor: darkMode ? underlayDark : underlayLight}]} 
                    placeholder={i18n.t('type-member-name')}
                    placeholderTextColor={underlayLight}
                    onChangeText={text => filterMember(text)}
                    />
                    <ScrollView>
                    {
                        filteredData.map((member:any) => {
                                return (
                                <TouchableHighlight
                                    key={member.id}
                                    onPress={()=>onMemberChosen(member, setFieldValue)}
                                    underlayColor={darkMode ? underlayDark : underlayLight}
                                    >
                                    <View style={{flexDirection:'row', borderBottomColor: darkMode ? '#111' : '#eee', borderBottomWidth: 1, padding: 20}}>
                                            <Text style={[darkMode ? cs.textDark : cs.textLight,{flex:1,}]}>{member.phone}</Text>
                                            <Text style={[darkMode ? cs.textDark : cs.textLight,{flex:2,}]}>{member.name}</Text>
                                    </View>
                                </TouchableHighlight>
                                )
                        })
                    }
                    </ScrollView>

            </View>
        </TouchableOpacity>
        </Modal>
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
