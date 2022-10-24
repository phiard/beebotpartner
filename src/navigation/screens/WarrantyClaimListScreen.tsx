import { useState, useEffect, useContext } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableHighlight } from "react-native";
import Loading from "src/components/Loading";
import axios from "src/lib/axios";
import { DataTable, Modal, TextInput } from "react-native-paper";
import { AuthContext } from "../AuthProvider";
import { View, Image } from "react-native";
import { BackHandler } from 'react-native';

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from "src/style/common";
import CollapsibleMemberRow from "src/components/CollapsibleMemberRow";
import CollapsibleWarrantyClaimRow from "src/components/CollapsibleWarrantyClaimRow";


const WarrantyClaimListScreen = (props:any) => {
    const placecholderImg = require('src/assets/placeholder.png');
    const placeholderImgUri = Image.resolveAssetSource(placecholderImg).uri;

    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ loadingMax, setLoadingMax ] = useState(true);
    const { user, locale, darkMode }:any = useContext(AuthContext);
    const { navigation } = props;
    
    const [ page, setPage ] = useState(0);
    const [ itemsPerPage, setItemsPerPage] = useState(10);
    const [ from, setFrom ] = useState(page*itemsPerPage);
    const [ max, setMax ] = useState(0);
    const [ to, setTo ] = useState(Math.min(((page+1) * itemsPerPage), max));

    const [imageModal, setImageModal] = useState<imageModal>({open:false,src:placeholderImgUri});
    const [trackingModal, setTrackingModal] = useState({open:false,tracking:'',id:null});

    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    useEffect(() => {
        setFrom(page * itemsPerPage);
        setTo(Math.min(((page+1) * itemsPerPage), max));
        getData();
    }, [page]);

    const openImageModal = (src:string) => {
        setImageModal({
            open:true,
            src:src
        })
    }
    
    const claimWarranty = (id:number) => {
        navigation.navigate(i18n.t('warranty-claim-screen'), { warrantyId: id })
    }
    
    const getData = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        await axios
        .get('/api/v1/app/user/warranty/claims', { params: { page: page+1 } })
        .then(response => {
            if(response.data.success) setData(response.data.data);
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false))
    };

    const getMax = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        await axios
        .get('/api/v1/app/user/warranty/claims/max')
        .then(response => {
            if(response.data.success) {
                setMax(response.data.data);
                setFrom(page * itemsPerPage);
                setTo(Math.min(((page+1) * itemsPerPage), response.data.data));
            }
        })
        .catch(error => console.error(error))
        .finally(() => setLoadingMax(false))
    };
    
    useEffect(() => {
        getMax();
        getData();

        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);

    const handleBackButtonClick = () => {
        navigation.pop();
        return true;
    }

    const updateTrackingNumber = (text:string) => {
        setTrackingModal({...trackingModal, tracking: text})
    };

    const submitTrackingNumber = async () => {
        if(!trackingModal.tracking || !trackingModal.id) return;

        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        await axios.post(`/api/v1/app/user/warranty/claims/tracking/${trackingModal.id}`, { tracking_number: trackingModal.tracking})
        .then(response => {
            if(response.status === 200 && response.data.success) {
                setLoading(true);
                getData();
                alert('tracking-number-updated');
            } else {
                alert(response.data.message);
            }
        })
        .catch(error => console.error(error))
        .finally(() => setLoadingMax(false))
    };

    const handleTrackingNumberButton = () => {
        setTrackingModal({...trackingModal, open:true});
    };

    const changePage = (page:number) => {
        setPage(page);
        setLoading(true);
    }

    if(loading || loadingMax) return <Loading />;

    return (
        <>
            <DataTable style={{backgroundColor: darkMode ? 'transparent' : "#fff",flex:1,}}>
                <DataTable.Header>
                    <DataTable.Title style={{flex:1,}}><Text style={darkMode ? cs.tableTitleDark : cs.tableTitleLight}>{i18n.t("id")}</Text></DataTable.Title>
                    <DataTable.Title style={{flex:2,}}><Text style={darkMode ? cs.tableTitleDark : cs.tableTitleLight}>{i18n.t("product-name")}</Text></DataTable.Title>
                    <DataTable.Title style={{flex:2,justifyContent:'flex-end', alignItems:'flex-end'}}>
                        <Text style={darkMode ? cs.tableTitleDark : cs.tableTitleLight}>{i18n.t("plate")}</Text>
                    </DataTable.Title>
                </DataTable.Header>
                <ScrollView>
                {
                    data.length > 0 ?
                    data.map((row:any, index:number) => {
                        return (
                            <CollapsibleWarrantyClaimRow 
                                key={index} 
                                row={row} 
                                locale={locale} 
                                handleTrackingNumberButton={handleTrackingNumberButton}
                                openImageModal={openImageModal} 
                                claimWarranty={claimWarranty} />
                        )
                    }) : 
                    (<DataTable.Row>
                        <DataTable.Cell>
                            {i18n.t("no-data-available")}
                        </DataTable.Cell>
                    </DataTable.Row>)
                }
                </ScrollView>
                {
                    max > 0 ?
                    (
                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(max/itemsPerPage)}
                            onPageChange={(page) => changePage(page)}
                            label={`${from + 1}-${to} ${i18n.t('of')} ${max}`}
                            showFastPaginationControls
                            style={{marginBottom:20,}}
                        />
                    ) : null
                }
            </DataTable>

            <Modal
                visible={imageModal.open}
                onDismiss={()=>setImageModal({open:false,src:placeholderImgUri})}
                >
                    <View style={{flex:1,justifyContent:'center',alignItems:'center', margin: 10,}}>
                        <View style={{flex:1, minHeight: 500, width:'100%',backgroundColor: darkMode ? '#000' : '#fff', borderRadius: 10, justifyContent: 'center', alignItems: 'stretch'}}>
                            <Image source={{uri:imageModal.src}} style={{flex:1, borderRadius: 10,}} />
                        </View>
                    </View>
            </Modal>
            <Modal
                visible={trackingModal.open}
                onDismiss={()=>setTrackingModal({open:false,tracking:'', id: null})}
                >
                    <View style={{flex:1,justifyContent:'center',alignItems:'center', margin: 10,}}>
                        <View style={{minHeight:200, padding: 10,width:'100%',backgroundColor: darkMode ? '#333' : '#fff', borderRadius: 10, justifyContent: 'flex-start', alignItems: 'stretch'}}>
                            <Text style={[darkMode ? cs.textDark : cs.textLight, {paddingBottom: 10,}] }>{i18n.t('add-tracking-number')}</Text>
                            <TextInput value={trackingModal.tracking} onChangeText={text=>updateTrackingNumber(text)} style={{minHeight:50, width:'100%',}} />
                            <TouchableHighlight onPress={() => {submitTrackingNumber()}} style={cs.button}>
                                <Text>{i18n.t('submit')}</Text>
                            </TouchableHighlight>
                            
                        </View>
                    </View>
            </Modal>
        </>
    );
}

type imageModal = {
    open:boolean, 
    src:string
};

export default WarrantyClaimListScreen;