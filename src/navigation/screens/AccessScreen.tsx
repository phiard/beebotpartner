import { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ScrollView, BackHandler } from "react-native";
import { Snackbar } from 'react-native-paper';
import axios from 'src/lib/axios';
import * as SecureStore from 'expo-secure-store';

import { AuthContext } from '../AuthProvider';

import { primaryColor, primaryColorHovered } from "@config";

import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import {en, id} from "@languages";
import cs from 'src/style/common';
import Loading from 'src/components/Loading';
import PinModal from 'src/components/PinModal';

const AccessScreen = ({navigation}:any) => {
    const { locale, darkMode, user, ownerAccess, setOwnerAccess }:any = useContext(AuthContext)
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({visible:false,message:''});
    const [modalVisible, setModalVisible] = useState(false);
    const [pinExists, setPinExists] = useState<boolean|null>(null)

    const i18n = new I18n({
        "en": en,
        "id": id,
    });
    
    i18n.locale = locale ? locale : Localization.locale;
    i18n.enableFallback = true;

    const checkPinCreated = async () => {
      setLoading(true)
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      await axios
      .get(`/api/v1/app/user/access/owner`)
      .then((response:any) => {
        if(response.data.success) setPinExists(true);
        else {
          setPinExists(false);
          if(ownerAccess) removeOwnerAccess();
          setLoading(false);
        }
      })
      .catch(error => {
          console.error(error.response)
      });
    };

    const removeOwnerAccess = async () => {
      setOwnerAccess(0);
      SecureStore.setItemAsync('ownerAccess', JSON.stringify(0));
    }

    const checkPinAuthenticity = async (pin:any) => {
      if(user.loggedIn) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.post('/api/v1/app/user/access/owner/check', {pin: pin})
        .then((response:any) => {
          if(response.status != 200 || !response.data.success) removeOwnerAccess();
        })
        .catch((error:any) => {
          removeOwnerAccess();
          console.error(error.response);
        }).finally(()=>{setLoading(false)});
      }
    };

    const enableOwnerAccess = async (pin:any, handleComplete:any) => {
      if(user.loggedIn) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.post('/api/v1/app/user/access/owner/enter', {pin: pin})
        .then((response:any) => {
          if(response.status === 200 && response.data.success) {
            setOwnerAccess(response.data.data);
            SecureStore.setItemAsync('ownerAccess', JSON.stringify(response.data.data));
            handleComplete(true, null)
          } else {
            handleComplete(false, response.data.message);
          }
        })
        .catch((error:any) => {
          if(error.response.data.message) {
            handleComplete(false, error.response.data.message);
          } else {
            handleComplete(false, null);
          }
          console.error(error.response);
        })
      }
    };

    const setOwnerAccessPin = async (pin:any, handleComplete:any) => {
      if(user.loggedIn) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        axios.post('/api/v1/app/user/access/owner/set', {pin: pin})
        .then((response:any) => {
          if(response.status === 200 && response.data.success) {
            setPinExists(true);
            setOwnerAccess(response.data.data);
            SecureStore.setItemAsync('ownerAccess', JSON.stringify(response.data.data));
            handleComplete(true, response.data.message)
          } else {
            handleComplete(false, response.data.message);
          }
        })
        .catch((error:any) => {
          if(error.response.data.message) {
            handleComplete(false, error.response.data.message);
          } else {
            handleComplete(false, null);
          }
          console.error(error.response);
        })
      }
    };

    const disableOwnerAccess = async () => {
      removeOwnerAccess();
      handleComplete(false, i18n.t('owner-access-disabled'));
    };

    const handleEnterPin = async () => {
      setModalVisible(true);
    }

    const handleCreatePin = async () => {
      setModalVisible(true);
    }
    
    const onPinEntered = async (pin:number) => {
      setModalVisible(false);
      setLoading(true);
      enableOwnerAccess(pin, handleComplete);
    }

    const onPinCreated = async (pin:number) => {
      setModalVisible(false);
      setLoading(true);
      setOwnerAccessPin(pin, handleComplete);
    }

    const handleComplete = (success:boolean, message?:string) => {
      if(message) {
        setSnackbar({visible:true, message:message});
      } else {
        if(success) {
            setSnackbar({visible:true, message:i18n.t('owner-access-success')});
            checkPinCreated();
        } else {
            setSnackbar({visible:true, message:i18n.t('owner-access-failed')});
        }
      }
      setLoading(false);
    }

    useEffect(() => {
      if(pinExists) {
        if(ownerAccess) {
          checkPinAuthenticity(ownerAccess);
        } else {
          setLoading(false);
        }
      }
    }, [pinExists]);

    useEffect(() => {
      checkPinCreated();

      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, []);

    const handleBackButtonClick = () => {
        navigation.pop();
        return true;
    }

    if(loading) return <Loading />;

    return (
      <View style={{flex:1,}}>
        <ScrollView style={{flex:1, padding: 10}}>
          <View>
            <View style={[cs.tile ,darkMode ? cs.cardDark : cs.cardLight, { borderWidth: 2, borderColor: ownerAccess ? '#3c3' : '#c33'}]}>
              <View>
                <Text style={{color: ownerAccess ? '#3c3' : '#c33', textAlign:'center', fontWeight: '600'}}>
                  {
                    pinExists 
                      ?
                      ownerAccess 
                        ?
                        i18n.t('owner-access-enabled') 
                        :
                        i18n.t('owner-access-disabled')
                      : 
                      i18n.t('owner-access-not-exists')
                  }
                </Text>
              </View>
            </View>
            <View style={[cs.flexRow, {padding: 10,}]}>
              {
                pinExists 
                  ?
                  ownerAccess
                    ?
                    <TouchableHighlight onPress={()=>{disableOwnerAccess()}} style={[cs.button, {margin:0, marginTop:0,}]} underlayColor={primaryColorHovered}>
                      <Text>{i18n.t('disable-access')}</Text>
                    </TouchableHighlight>
                    :
                    <TouchableHighlight onPress={()=>{handleEnterPin()}} style={[cs.button, {margin:0, marginTop:0,}]} underlayColor={primaryColorHovered}>
                      <Text>{i18n.t('enable-access')}</Text>
                    </TouchableHighlight>
                  :
                  <TouchableHighlight onPress={()=>{handleCreatePin()}} style={[cs.button, {margin:0, marginTop:0,}]} underlayColor={primaryColorHovered}>
                    <Text>{i18n.t('create-access-pin')}</Text>
                  </TouchableHighlight>
              }
            </View>
          </View>
        </ScrollView>
        {
          modalVisible ?
          (
            <PinModal
              visible={modalVisible}
              setVisible={setModalVisible}
              onPinEntered={pinExists ? onPinEntered : onPinCreated}
              createPin={pinExists ? false : true}
              locale={locale}
            />
          ) : null
        }
        
        <Snackbar
          duration={5000}
          visible={snackbar.visible}
          style={darkMode ? cs.cardDark : cs.cardLight}
          onDismiss={() => setSnackbar({visible:false,message:''})}
          action={{
            icon: 'close',
            label: i18n.t('close'),
            onPress: () => setSnackbar({visible:false,message:''}),
          }}
          >
          <Text style={{color: darkMode ? '#fff' : '#222'}}>{snackbar.message}</Text>
        </Snackbar>
      </View>
    );
}

export default AccessScreen;