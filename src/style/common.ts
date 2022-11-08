'use strict';
import { primaryColor, primaryColorSurfaceDark, primaryColorSurfaceLight, secondaryColor } from '@config';
import { StyleSheet } from 'react-native';

const cs = StyleSheet.create({
    button: {
        marginTop: 20,
        padding: 20,
        backgroundColor: secondaryColor,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
    },
    buttonOutline: {
        marginTop: 20,
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        borderWidth: 1,
        borderColor: secondaryColor,
    },
    flexCenter: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    flex: {
        display: 'flex',
    },
    flexRow: {
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems: 'center'
    },
    textBold: {
        fontWeight: '700',
    },
    textSemiBold: {
        fontWeight: '500',
    },
    textRegular: {
        fontWeight: '400',
    },
    textThin: {
        fontWeight: '300',
    },

    tableTitleLight: {
        color: '#555',
    },
    tableTitleDark: {
        color: '#ccc',
    },

    tableContentTextLight: {
        color: '#111',
        fontWeight: '500',
    },
    tableContentTextDark: {
        color: '#eee',
        fontWeight: '500',
    },

    tableSubTextLight: {
        color: '#111',
        fontSize: 11,
    },
    tableSubTextDark: {
        color: '#eee',
        fontSize: 11,
    },

    
    tile: {
        padding: 16,
        margin: 8,
        shadowColor: '#888',
        borderRadius: 4,
    },
    tileTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    tileSubtitle: {
        fontWeight: '500',
    },
    tileContent: {
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 36,
        textTransform: 'uppercase',
        color: primaryColor,
    },
    
    tileLight: {
        marginHorizontal: 8,
        marginVertical: 6,
        backgroundColor: '#fff',
        shadowColor: '#888',
        borderRadius: 4,
    },
    tileDark: {
        marginHorizontal: 8,
        marginVertical: 6,
        backgroundColor: '#222',
        shadowColor: '#888',
        borderRadius: 4,
    },
    tileTextLight: {
        color: '#111',
    },
    tileTextDark: {
        color: '#fff',
    },

    colorLight: {
        color: '#111',
    },
    colorDark: {
        color: '#fff',
    },
    backgroundLight: {
        backgroundColor: '#ddd',
    },
    backgroundDark: {
        backgroundColor: '#000',
    },
    cardLight: {
        backgroundColor: '#fff',
    },
    cardDark: {
        backgroundColor: '#222',
    },

    
    textFieldLabelLight: {
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 20,
        color: '#111',
    },
    textFieldLabelDark: {
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 20,
        color: '#eee',
    },
    textFieldWrapper: {
        margin: 10,
    },
    textFieldBase: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textFieldLight: {
      padding: 20,
      backgroundColor: '#fff',
      border: 'solid 1px #333',
      borderRadius: 10,
      minWidth: '100%',
      position: 'relative',
    },
    textFieldDark: {
      padding: 20,
      backgroundColor: '#333',
      border: 'solid 1px #333',
      color: '#fff',
      borderRadius: 10,
      minWidth: '100%',
      position: 'relative',
    },
    helperText: {
        color: '#e33',
        marginLeft: 10,
        marginTop: 10,
    },

    
    menu: {
        width:'100%',
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 10,
    },
    menuDark: {
        backgroundColor: "#333",
        borderColor: "#333",
    },
    menuLight: {
        backgroundColor: "#fff",
        borderColor: "#fff",
    },
    textLight: {
        color: '#222',
    },
    textDark: {
        color: '#fff',
    },
    textSubtitleLight: {
        color: '#333',
    },
    textSubtitleDark: {
        color: '#ddd',
    },
    surfaceDark: {
        backgroundColor: primaryColorSurfaceDark,
    },
    surfaceLight: {
        backgroundColor: primaryColorSurfaceLight,
    },
    active: {
        borderColor: primaryColor
    }
});

// module.exports = cs;
export default cs;