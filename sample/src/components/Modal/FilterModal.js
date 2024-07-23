
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, TouchableOpacity, Alert, PanResponder, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '.././../utils';
import { whiteColor, darkgrayColor, redColor, blackColor, goldColor, lightGrayColor, lightBlueColor, grayColor, lightGrayOpacityColor, blackOpacity5, mediumGray } from '../../constants/Color'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { spacings, style } from '../../constants/Fonts';
import { BaseStyle } from '../../constants/Style';
import { ALL, APPLY, AVAILABILITY, BRAND, CLEAR, FILTER, INSTOCK, OUT_OF_STOCK, PRICE } from '../../constants/Constants';
import { logEvent } from '@amplitude/analytics-react-native';
import { useSelector } from 'react-redux';
import { useThemes } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../constants/Color';
const { alignItemsCenter, resizeModeContain, textAlign, alignJustifyCenter, flex, borderRadius10, overflowHidden, borderWidth1, flexDirectionRow, justifyContentSpaceBetween, alignSelfCenter, positionAbsolute } = BaseStyle;

const FilterModal = ({ applyFilters, onClose, visible, allProducts, vendor, onSelectVendor }) => {
  const { isDarkMode } = useThemes();
  const colors = isDarkMode ? darkColors : lightColors;
  const selectedItem = useSelector((state) => state.menu.selectedItem);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [showAvailibility, setShowAvailibitlity] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState();
  const [priceRange, setPriceRange] = useState();
  const [startPricePosition, setStartPricePosition] = useState(0);
  const [endPricePosition, setEndPricePosition] = useState(30);
  const [selectedVendor, setSelectedVendor] = useState(null);
  // let range = selectedItem === "Beauty" ? 10000 : 100;

  useEffect(() => {
    if (allProducts?.length > 0) {
      const prices = allProducts.map(product => parseFloat(product.variants.nodes[0]?.price)).filter(price => !isNaN(price));
      const maxPrice = Math.max(...prices);
      setEndPrice(maxPrice.toString());
      setPriceRange(maxPrice.toString())
    }
  }, [allProducts]);

  const handleStartPriceChange = (position) => {
    const newPos = Math.max(0, Math.min(endPricePosition - 20, position)); // Ensuring the start thumb doesn't cross the end thumb
    const price = Math.round((newPos / wp(90)) * priceRange); // Adjusting according to the range and position
    setStartPrice(price);
    setMinPrice(price.toString());
    setStartPricePosition(newPos);
  };

  const handleEndPriceChange = (position) => {
    const newPos = Math.max(startPricePosition + 20, Math.min(wp(90), position)); // Ensuring the end thumb doesn't cross the start thumb
    const price = Math.round((newPos / wp(90)) * priceRange); // Adjusting according to the range and position
    setEndPrice(price);
    setMaxPrice(price.toString());
    setEndPricePosition(newPos);
  };

  const handleMinPriceChange = (value) => {
    const price = parseFloat(value) || 0;
    const newPos = (price / priceRange) * wp(90);
    setMinPrice(value);
    setStartPrice(price);
    setStartPricePosition(newPos);
  };

  const handleMaxPriceChange = (value) => {
    const price = parseFloat(value) || 0;
    const newPos = (price / priceRange) * wp(90);
    setMaxPrice(value);
    setEndPrice(price);
    setEndPricePosition(newPos);
  };

  const startPricePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      handleStartPriceChange(gestureState.moveX - 10); // Adjusting for slider width
    },
  });

  const endPricePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      handleEndPriceChange(gestureState.moveX - 10); // Adjusting for slider width
    },
  });

  const handleApplyFilters = () => {
    const filteredProducts = allProducts.filter(product => {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      const productPrice = parseFloat(product.variants.nodes[0]?.price);
      if (minPrice && maxPrice) {
        return productPrice >= min && productPrice <= max;
      } else if (minPrice) {
        return productPrice >= min;
      } else if (maxPrice) {
        return productPrice <= max;
      }
      return true;
    });
    applyFilters(filteredProducts);
    if (filteredProducts.length === 0) {
      Alert.alert("No products are currently available in this range.");
      setShowPriceRange(false)
    }
    if (filteredProducts.length > 0) {
      onClose(),
        setShowPriceRange(false)
    }
    logEvent(`Filter_Applied minPrice:${minPrice} maxPrice ${maxPrice}`);
  };

  const applyFilterByQuantity = () => {
    const filteredByQuantity = allProducts.filter(product => {
      const inventoryQuantities = product.variants.nodes.map(variant => variant.inventoryQuantity);
      if (showInStock) {
        // Filter in-stock products (inventory quantity > 0)
        return inventoryQuantities.some(quantity => quantity > 0);
      } else {
        // Filter out-of-stock products (inventory quantity === 0)
        return inventoryQuantities.every(quantity => quantity === 0);
      }
    });
    if (filteredByQuantity.length === 0) {
      Alert.alert("No products are currently available.");
      // onClose();
      setShowAvailibitlity(false);
    } else {
      applyFilters(filteredByQuantity);
      onClose();
      setShowAvailibitlity(false);
    }
    logEvent(`Availability_Filter_Applied  ${showInStock}`);
  };

  const togglePriceRange = () => {
    setShowPriceRange(!showPriceRange);
    logEvent('Price_Range_Toggled');
  };

  const toggleBrand = () => {
    setShowBrand(!showBrand);
    logEvent('Brand_Filter_Toggled');
  };

  const toggleAvailability = () => {
    setShowAvailibitlity(!showAvailibility);
    logEvent('Availability_Filter_Toggled');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ backgroundColor: blackOpacity5, flex: 1 }}>
        <View style={[positionAbsolute, { backgroundColor: colors.whiteColor, bottom: 0, height: hp(60), borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>

          <View style={[styles.modalHeader, flexDirectionRow, alignJustifyCenter]}>
            <View style={[{ width: "80%" }]}>
              <Text style={[styles.headertext, { color: colors.blackColor }]}>Apply Filter</Text>
            </View>
            <TouchableOpacity style={styles.backIconBox} onPress={onClose}>
              <Ionicons name={"close"} size={30} color={colors.blackColor} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <TouchableOpacity style={[styles.Box, flexDirectionRow, justifyContentSpaceBetween]} onPress={toggleBrand}>
              <Text style={[styles.text, { color: colors.blackColor }]}>{BRAND}</Text>
              <View style={[styles.backIconBox]} >
                <Text style={[styles.graytext, { color: colors.blackColor }]}>{ALL}</Text>
              </View>
            </TouchableOpacity>
            {showBrand && <View>
              {vendor.map(vendor => (
                <TouchableOpacity
                  key={vendor}
                  style={[styles.vendorButton, flexDirectionRow, { backgroundColor: isDarkMode ? grayColor : whiteColor }]}
                  onPress={() => { setSelectedVendor(vendor), onSelectVendor(vendor), onClose(), setShowBrand(false), logEvent(`Vendor_Selected ${vendor}`); }}
                >
                  <Text style={[styles.graytext, { color: colors.blackColor }]}>{vendor}</Text>
                  {selectedVendor === vendor && <Ionicons name="checkmark" size={20} color={colors.blackColor} style={{ marginLeft: "auto", marginRight: spacings.xxxxLarge }} />}
                </TouchableOpacity>
              ))}
            </View>}
            <TouchableOpacity style={[styles.Box, flexDirectionRow, justifyContentSpaceBetween]} onPress={togglePriceRange}>
              <Text style={[styles.text, { color: colors.blackColor }]}>{PRICE}</Text>
              <View style={[styles.backIconBox]} >
                <Text style={[styles.graytext, { color: colors.blackColor }]}>{ALL}</Text>
              </View>
            </TouchableOpacity>
            {showPriceRange && (
              <View style={[styles.container]}>
                <View style={[flexDirectionRow, alignItemsCenter]}>
                  <TextInput
                    placeholder="Min Price"
                    placeholderTextColor={colors.grayColor}
                    value={minPrice}
                    onChangeText={handleMinPriceChange}
                    keyboardType="numeric"
                    style={[styles.input, borderRadius10, borderWidth1,{ color: colors.blackColor }]}
                  />
                  <TextInput
                    placeholder="Max Price"
                    placeholderTextColor={colors.grayColor}
                    value={maxPrice}
                    onChangeText={handleMaxPriceChange}
                    keyboardType="numeric"
                    style={[styles.input, borderRadius10, borderWidth1,{ color: colors.blackColor }]}
                  />
                </View>
                <View style={styles.releaseBox}>
                  <Text style={[styles.graytext, { color: colors.blackColor }]}>Min Price:{startPrice}</Text>
                  <Text style={[styles.graytext, { color: colors.blackColor }]}>Max Price:{endPrice}</Text>
                </View>
                <View style={styles.mainRangeSection}>
                  <View style={[styles.slider, { left: startPricePosition }]} {...startPricePanResponder.panHandlers} />
                  <View style={[styles.slider, { left: endPricePosition }]} {...endPricePanResponder.panHandlers} />
                </View>
                <View style={[flexDirectionRow, alignJustifyCenter, flexDirectionRow, { marginTop: spacings.xxxxLarge }]}>
                  <Pressable style={[styles.applyButton, alignJustifyCenter, borderRadius10]} onPress={handleApplyFilters}>
                    <Text style={styles.applyButtonText}>{APPLY}</Text>
                  </Pressable>
                </View>
              </View>)}
            {/* <TouchableOpacity style={[styles.Box, flexDirectionRow, justifyContentSpaceBetween]} onPress={toggleAvailability}>
              <Text style={styles.text}>{AVAILABILITY}</Text>
              <View style={[styles.backIconBox]} >
                <Text style={[styles.graytext]}>{ALL}</Text>
              </View>
            </TouchableOpacity>
            {showAvailibility &&
              <View style={[styles.container]}>
                <View style={[flexDirectionRow, justifyContentSpaceBetween]}>
                  <TouchableOpacity style={[styles.availabilityButton, alignJustifyCenter, borderRadius10]} onPress={() => setShowInStock(true)}>
                    <Text style={styles.availabilityButtonText}>{INSTOCK}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.availabilityButton, alignJustifyCenter, borderRadius10]} onPress={() => setShowInStock(false)}>
                    <Text style={styles.availabilityButtonText}>{OUT_OF_STOCK}</Text>
                  </TouchableOpacity>
                </View>
                <View style={[flexDirectionRow, alignJustifyCenter, flexDirectionRow, { marginTop: spacings.xxxxLarge }]}>
                  <Pressable style={[styles.applyButton, alignJustifyCenter, borderRadius10]} onPress={applyFilterByQuantity}>
                    <Text style={styles.applyButtonText}>{APPLY}</Text>
                  </Pressable>
                </View>
              </View>
            } */}
            {/* <TouchableOpacity style={[styles.modalHeader, flexDirectionRow, justifyContentSpaceBetween]} onPress={toggleBrand}>
        <Text style={styles.text}>Body</Text>
        <View style={[styles.backIconBox, alignJustifyCenter]} >
          <Text style={[styles.graytext]}>All</Text>
        </View>
      </TouchableOpacity> */}
            {/* <TouchableOpacity style={[styles.button, borderRadius10, alignJustifyCenter, alignSelfCenter, positionAbsolute]} onPress={onClose}>
        <Text style={[styles.text, { color: whiteColor }]}>View Items</Text>
      </TouchableOpacity> */}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    width: '100%',
    padding: spacings.large,
    borderBottomWidth: 1,
    borderBottomColor: lightGrayOpacityColor,
    height: hp(7)
  },
  Box: {
    width: '100%',
    padding: spacings.xxLarge,
    // borderBottomWidth: 1,
    // borderBottomColor: lightGrayOpacityColor,
    // height: hp(8)
  },
  headertext: {
    fontSize: style.fontSizeLargeXX.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: blackColor,
  },
  text: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: blackColor,
  },
  graytext: {
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: grayColor,
  },
  backIconBox: {
    width: "20%",
    alignItems: "flex-end"
  },
  container: {
    width: wp(100),
    padding: spacings.large,
  },
  input: {
    width: wp(46),
    height: 40,
    borderColor: lightGrayOpacityColor,
    paddingHorizontal: spacings.large,
    marginRight: spacings.large,
    color: blackColor
  },
  applyButton: {
    backgroundColor: redColor,
    width: wp(35),
    height: hp(5),
  },
  applyButtonText: {
    color: whiteColor,
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
  },

  button: {
    bottom: 20,
    left: '5%',
    width: '90%',
    height: hp(7),
    backgroundColor: redColor,
  },
  vendorButton: {
    backgroundColor: whiteColor,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: lightGrayOpacityColor,
    // marginRight: 10,
  },
  availabilityButton: {
    backgroundColor: lightBlueColor,
    width: wp(45),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  availabilityButtonText: {
    color: whiteColor,
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
  },
  releaseBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mainRangeSection: {
    position: 'relative',
    height: 20,
    backgroundColor: mediumGray,
    // marginHorizontal: 20,
    borderRadius: 10,
  },
  slider: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 20,
    backgroundColor: redColor,
    borderRadius: 10,
  },
});

export default FilterModal;
