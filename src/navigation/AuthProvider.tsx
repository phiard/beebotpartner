import { useState, createContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from '../lib/axios';
import { Alert } from 'react-native';

const emptyUser = {
  loggedIn:false,
  username:null,
  token:null,
  status:0,
};

type loginData = {
  username:string,
  password:string,
}

export const AuthContext = createContext({});

export const AuthProvider = (props:any) => {
  const { children } = props;
  const [user, setUser] = useState(emptyUser);
  const [locale, setLocale] = useState(null);
  const [error, setError] = useState<any>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);
    
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        locale,
        setLocale,
        darkMode,
        setDarkMode,
        login: async ({username, password}:loginData, handleComplete:any) => {
          try {
            axios.post('/api/v1/app/login', {
              username,
              password,
            })
            .then((response:any) => {
              if(response.status === 200 && response.data.success) {
                const userData = response.data.user;
                const userResponse = {
                  loggedIn: true,
                  token: response.data.token,
                  id: userData.id,
                  name: userData.name,
                  username: userData.username,
                  email: userData.email,
                  status: userData.status,
                  gankbeebot: userData.gankbeebot,
                  campaign: userData.campaign,
                  permission: userData.permission,
                  totalComission: userData.totalComission,
                  totalUsedVoucher: userData.totalUsedVoucher,
                }

                setUser(userResponse);
                SecureStore.setItemAsync('user', JSON.stringify(userResponse));

                setLocale(userData.locale);
                SecureStore.setItemAsync('locale', JSON.stringify(userData.locale));

                setDarkMode(userData.dark_mode);
                SecureStore.setItemAsync('darkMode', JSON.stringify(userData.dark_mode));
  
                handleComplete("Success");
              } else {
                setUser(emptyUser);
                handleComplete("Internal Server Error");
              }
            })
            .catch((error:any) => {
              if (error.response && error.response.status === 401) handleComplete("Username or Password is Invalid");
              else handleComplete("Internal Server Error");
              setUser(emptyUser);
              console.error(error.response);
            })
          } catch (error) {
            Alert.alert("Internal Server Error");
          }
          
        },
        logout: async () => {
          axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

          axios.post('/api/v1/app/logout')
          .then((response:any) => {
          })
          .catch((error:any) => {
            console.error(error.response);
            setError("Internal Server Error");
          }).finally(() => {
            setUser(emptyUser);
            SecureStore.deleteItemAsync('user')
          })
        },
        getUser: async () => {
          axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

          axios.get('/api/v1/app/user')
          .then((response:any) => {
            if(response.status === 200) {
              if(!response.data.success) {
                setError(response.data.message);
                return null;
              }

              const userData = response.data;
              const userResponse = {
                loggedIn: true,
                username: userData.username,
                id: userData.id,
                name: userData.name,
                email: userData.email,
                status: userData.status,
                campaign: userData.campaign,
                gankbeebot: userData.gankbeebot,
                permission: userData.permission,
                totalComission: userData.totalComission,
                totalUsedVoucher: userData.totalUsedVoucher,
              }
              const newData = {token:user.token,...userResponse};
              setUser(newData);
              SecureStore.setItemAsync('user', JSON.stringify(newData));
              
              setLocale(userData.locale);
              SecureStore.setItemAsync('locale', JSON.stringify(userData.locale));

              setDarkMode(userData.dark_mode);
              SecureStore.setItemAsync('darkMode', JSON.stringify(userData.dark_mode));
            } else {
              setUser(emptyUser);
              setError("Internal Server Error");
            }
          })
          .catch((error:any) => {
            console.error(error);
            setError("Internal Server Error");
            setUser(emptyUser);
            setError("Internal Server Error");
          })
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
}