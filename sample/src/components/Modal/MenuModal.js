import React from 'react';
import { Modal, View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '.././../utils';
import { blackColor, lightGrayOpacityColor, whiteColor, blackOpacity5 } from '../../constants/Color';
import { spacings, style } from '../../constants/Fonts';
import { BaseStyle } from '../../constants/Style';
import { USER_IMAGE, WHITE_USER_IMAGE } from '../../assests/images'
import Feather from 'react-native-vector-icons/dist/Feather';
import { useSelector } from 'react-redux';
import { LOGIN, SIGNUP, ABOUT_US, CONTACT_US } from '../../constants/Constants';
import Header from '../Header';
import { useThemes } from '../../context/ThemeContext';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import { lightColors, darkColors } from '../../constants/Color';
const { positionAbsolute, alignItemsCenter, flexDirectionRow, justifyContentSpaceBetween } = BaseStyle;

const MenuModal = ({ modalVisible, setModalVisible, onPressCart, onPressSearch, navigation, onPressShopByCatagory }) => {
  const { isDarkMode, toggleTheme } = useThemes();
  const colors = isDarkMode ? darkColors : lightColors;
  const userLoggedIn = useSelector(state => state.auth.isAuthenticated);
  const onPressShopByCate = () => {
    onPressShopByCatagory()
    setModalVisible(!modalVisible)
  }
  const onPressSaved = () => {
    navigation.navigate('Saved')
    setModalVisible(!modalVisible)
  }
  const onPressProfile = () => {
    navigation.navigate('Profile')
    setModalVisible(!modalVisible)
  }
  const onPressLogin = () => {
    navigation.navigate('AuthStack')
    setModalVisible(!modalVisible)
  }

  const onPressSignUp = () => {
    navigation.navigate('AuthStack')
    setModalVisible(!modalVisible)
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalView, { backgroundColor: colors.whiteColor }]}>
          <Header
            closeIcon={true}
            image={true}
            textinput={true}
            navigation={navigation}
            onClosePress={() => setModalVisible(!modalVisible)}
            shoppingCart={true} />
          <Pressable style={[styles.menuItem, justifyContentSpaceBetween, flexDirectionRow, alignItemsCenter]} onPress={onPressShopByCate}>
            <Text style={[styles.menuText, { color: colors.blackColor }]}>{"Shop By Categories"}</Text>
            <Feather name={"chevron-right"} size={25} color={colors.blackColor} />
          </Pressable>
          <Pressable style={[styles.menuItem, justifyContentSpaceBetween, flexDirectionRow, alignItemsCenter]} onPress={onPressSaved}>
            <Text style={[styles.menuText, { color: colors.blackColor }]}>{"Saved"}</Text>
            <Feather name={"chevron-right"} size={25} color={colors.blackColor} />
          </Pressable>
          <Pressable style={[styles.menuItem, justifyContentSpaceBetween, flexDirectionRow, alignItemsCenter]} onPress={onPressProfile}>
            <Text style={[styles.menuText, { color: colors.blackColor }]}>{"Profile"}</Text>
            <Feather name={"chevron-right"} size={25} color={colors.blackColor} />
          </Pressable>
          <Pressable style={[styles.menuItem, flexDirectionRow, justifyContentSpaceBetween, alignItemsCenter]}
            onPress={toggleTheme}
          >
            <Pressable onPress={toggleTheme} style={[flexDirectionRow, alignItemsCenter]}>
              {/* <FontAwesome name={isDarkMode ? 'moon-o' : 'sun-o'} size={24} color={isDarkMode ? whiteColor : blackColor} /> */}
              <Text style={[styles.menuText, { color: colors.blackColor }]}>{isDarkMode ? 'Dark' : 'Light'} Mode</Text>
            </Pressable>
            <Pressable onPress={toggleTheme} style={[styles.toggleButton]}>
              <Feather
                name={isDarkMode ? 'toggle-right' : 'toggle-left'}
                size={35}
                color={isDarkMode ? '#81b0ff' : '#333333'}
              />
            </Pressable>
          </Pressable>
          {!userLoggedIn && <Pressable style={[styles.menuItem, justifyContentSpaceBetween, flexDirectionRow, alignItemsCenter]} onPress={onPressSignUp}>
            <Text style={[styles.menuText, { color: colors.blackColor }]}>{SIGNUP}</Text>
            <Feather name={"chevron-right"} size={25} color={colors.blackColor} />
          </Pressable>}
          {!userLoggedIn && <View style={[styles.bottomContainer, positionAbsolute]}>
            <Pressable style={[styles.loginItem, flexDirectionRow, alignItemsCenter]} onPress={onPressLogin}>
              {/* <MaterialIcons name={"person-outline"} size={30} color={blackColor} /> */}
              <Image source={isDarkMode ? WHITE_USER_IMAGE : USER_IMAGE} style={[{ resizeMode: "contain", width: wp(8), height: hp(3.5) }]} />
              <Text style={[styles.menuText, { paddingLeft: spacings.medium, color: colors.blackColor }]}>{LOGIN}</Text>
            </Pressable>
          </View>}
        </View>
      </View>
    </Modal >
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: wp(100),
    height: hp(100)
  },
  modalView: {
    width: wp(100),
    height: hp(100),
    backgroundColor: whiteColor
  },
  menuItem: {
    padding: spacings.xxxLarge,
    borderBottomWidth: 1,
    borderBottomColor: lightGrayOpacityColor,
  },
  menuText: {
    fontSize: style.fontSizeMedium.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: blackColor,
  },
  bottomContainer: {
    width: wp(100),
    bottom: 0
  },
  loginItem: {
    padding: spacings.large,
    width: '100%',
  },
  loadingBoxBackground: {
    backgroundColor: blackOpacity5,
  },
});

export default MenuModal;
