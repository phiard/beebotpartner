import { Text, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import Loading from './Loading';

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";

import { useContext } from 'react';
import { AuthContext } from 'src/navigation/AuthProvider';

import cs from 'src/style/common';


export default function CampaignsTable(props:any) {
    const { campaigns, loading, locale, handleCampaignPress } = props;
    const { darkMode }:any = useContext(AuthContext)
    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    if(loading) return <Loading />;

    return (
        <View>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title><Text style={darkMode ? cs.tableTitleDark : cs.tableTitleLight}>{i18n.t("campaign")}</Text></DataTable.Title>
                    <DataTable.Title style={{justifyContent:'flex-end', alignItems:'flex-end'}}><Text style={darkMode ? cs.tableTitleDark : cs.tableTitleLight}>{i18n.t("used")}</Text></DataTable.Title>
                </DataTable.Header>
                {
                    campaigns.length > 0 ?
                    campaigns.map((row:any, index:number) => {
                        return (
                        <DataTable.Row key={index} onPress={()=>handleCampaignPress(row.id)}>
                            <DataTable.Cell style={{flex:1,alignItems:'center',justifyContent:'flex-start',display:'flex'}}>
                                <View style={{flexDirection:'column', paddingVertical: 10,}}>
                                    <View style={{flex:1, width:'100%',flexDirection:'row', display:'flex', alignItems:'center'}}>
                                        <View style={{width: 10, height: 10, borderRadius: 5, marginRight: 5, elevation: 4, backgroundColor: row.status_code ? '#3f3' : '#f33'}}></View>
                                        <Text style={darkMode ? cs.tableContentTextDark : cs.tableContentTextLight}>{ row.name }</Text>
                                    </View>
                                    <Text style={[darkMode ? cs.tableSubTextDark : cs.tableSubTextLight, {marginLeft: 15,}]}>{`${row.start_date} → ${row.end_date}`}</Text>
                                    <Text style={[darkMode ? cs.tableSubTextDark : cs.tableSubTextLight, {marginLeft: 15,}]}>{row.status}</Text>
                                </View>
                            </DataTable.Cell>
                            <DataTable.Cell style={{flex:0,justifyContent:'flex-end', alignItems:'center', paddingVertical: 10,}}><Text style={darkMode ? cs.tableContentTextDark : cs.tableContentTextLight}>{row.used}</Text></DataTable.Cell>
                        </DataTable.Row>
                        )
                    }) : 
                    (<DataTable.Row>
                        <DataTable.Cell>
                            {i18n.t("no-data-available")}
                        </DataTable.Cell>
                    </DataTable.Row>)
                }
            </DataTable>
            
            <View>
                <Text style={[darkMode ? cs.textDark : cs.textLight, {marginVertical: 15,}]}>{i18n.t('click-for-details')}</Text>
            </View>
        </View>
    );
}
