import { Text, TouchableHighlight, View } from 'react-native';
import { DataTable, Modal } from 'react-native-paper';
import Loading from './Loading';

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";

import { useContext, useState } from 'react';
import { AuthContext } from 'src/navigation/AuthProvider';

import cs from 'src/style/common';
import { underlayDark, underlayLight } from '@config';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';

const Icon = createIconSetFromIcoMoon(
    require('src/assets/fonts/icomoon/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);


export default function MemberSelector(props:any) {
    const { member, setMember, memberData, modalOpen, setModalOpen, handleChooseMember, handleRemoveMember, loading } = props;
    const { darkMode, locale }:any = useContext(AuthContext)
    const i18n = new I18n({
        "en": en,
        "id": id,
    });


    const handlePressChooseMember = () => {
        setModalOpen(true)
        // handleChooseMember();

    }
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    if(loading) return <Loading />;

    return (
        <View style={cs.textFieldWrapper}>
            <TouchableHighlight
                onPress={()=>{handlePressChooseMember()}} 
                underlayColor={darkMode ? underlayDark : underlayLight} 
                style={[cs.button, darkMode ? cs.textFieldDark : cs.textFieldLight, {flex:1, marginRight: 5, minWidth: 0}]}
                >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name="user" color={'#333'} size={24} />
                    <Text>{i18n.t('select-member')}</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
}
