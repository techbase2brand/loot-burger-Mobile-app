import { StyleSheet, Text, Animated, ImageBackground } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { whiteColor, redColor } from '../constants/Color'
import { LOVE_DRINK } from '../constants/Constants'
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { SPLASH_IMAGE } from '../assests/images'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { logEvent } from '@amplitude/analytics-react-native';

const { positionAbsolute, alignJustifyCenter, flexDirectionRow, flex, resizeModeContain } = BaseStyle;
export default function CustomSplashScreen() {
  const leftDoorAnim = useRef(new Animated.Value(0)).current;
  const rightDoorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // openDoor()
    logEvent('Splash Screen Initialized');
  }, [])

  const openDoor = () => {
    Animated.parallel([
      Animated.timing(leftDoorAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rightDoorAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      closeDoor();
    }, 2000);
  };

  const closeDoor = () => {
    Animated.parallel([
      Animated.timing(leftDoorAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rightDoorAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // setIsDoorOpen(false);
    });
  };

  const leftDoorRotation = leftDoorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  const rightDoorRotation = rightDoorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <ImageBackground source={SPLASH_IMAGE} style={[flexDirectionRow, flex, resizeModeContain]} >
      {/* <Animated.View style={[styles.door, alignJustifyCenter, positionAbsolute, { transform: [{ rotateY: leftDoorRotation }] }]}>
        <Text style={[styles.text, { color: whiteColor }]}>{LOVE_DRINK}</Text>
      </Animated.View>
      <Animated.View style={[styles.door, alignJustifyCenter, positionAbsolute, { transform: [{ rotateY: rightDoorRotation }] }]}>
        <Text style={[styles.text, { color: whiteColor }]}>{LOVE_DRINK}</Text>
      </Animated.View> */}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  door: {
    width: wp(100),
    height: hp(100),
    backgroundColor: redColor,
    zIndex: 1,
  },
  text: {
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: whiteColor,
  },
})
