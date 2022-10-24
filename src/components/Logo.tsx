import { Image, View } from "react-native";

export default function Logo() {
    return (
        <View>
            <Image 
                source={require('../assets/img/logo-round.png')} 
                style={{resizeMode: 'contain',maxHeight:100}} />
        </View>
    );
}
