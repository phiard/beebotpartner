import { primaryColor } from "@config";
import { View, StyleSheet, ActivityIndicator } from "react-native";

export default function Loading() {
    return <View style={styles.loading}><ActivityIndicator size="large" color={primaryColor} /></View>;
}


const styles = StyleSheet.create({
    loading: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
});