import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, FlatList, Pressable, ActivityIndicator, ImageBackground, Alert } from 'react-native';
import useShopify from '../hooks/useShopify';
import { Colors, useTheme } from '../context/Theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { blackColor, redColor, whiteColor, grayColor, lightGrayOpacityColor, mediumGray } from '../constants/Color'
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import Header from '../components/Header'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { logEvent } from '@amplitude/analytics-react-native';
import { getAdminAccessToken, getStoreDomain, STOREFRONT_DOMAIN, ADMINAPI_ACCESS_TOKEN, STOREFRONT_ACCESS_TOKEN, LOADER_NAME } from '../constants/Constants'
import { ShopifyProduct } from '../../@types';
import { BACKGROUND_IMAGE } from '../assests/images'
import Product from '../components/ProductVertical';
import { useCart } from '../context/Cart';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import LoaderKit from 'react-native-loader-kit';
import { useThemes } from '../context/ThemeContext';
import { lightColors, darkColors } from '../constants/Color';
const { flex, textAlign, alignItemsCenter, resizeModeContain, borderRadius10, positionRelative, alignJustifyCenter, resizeModeCover } = BaseStyle;
type Props = NativeStackScreenProps<RootStackParamList, 'CatalogScreen'>;

function CatalogScreen({ navigation }: Props) {
  const selectedItem = useSelector((state) => state.menu.selectedItem);
  // const STOREFRONT_DOMAIN = getStoreDomain(selectedItem)
  // const ADMINAPI_ACCESS_TOKEN = getAdminAccessToken(selectedItem)
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { queries } = useShopify();
  const { addToCart, addingToCart } = useCart();
  const [fetchCollections, { data: collectionData }] = queries?.collections;
  const [products, setProducts] = useState([]);
  const [inventoryQuantities, setInventoryQuantities] = useState('');
  const [tags, setTags] = useState<string[][]>([]);
  const [options, setOptions] = useState([]);
  const [productVariantsIDS, setProductVariantsIDS] = useState([]);
  const [loading, setLoading] = useState(false)
  const [collectionTitle, setCollectionTitle] = useState('')
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [collectionsFetched, setCollectionsFetched] = useState(false);
  const [shopifyCollection, setShopifyCollection] = useState([])
  const { isDarkMode } = useThemes();
  const themecolors = isDarkMode ? darkColors : lightColors;
  useEffect(() => {
    logEvent('Catalog Screen Initialized');
  }, [])

  useEffect(() => {
    // fetchCollections({
    //   variables: {
    //     // first: selectedItem === "Food" ? 10 : selectedItem === "Drinks" ? 50 : 50,
    //     first: 100
    //   },
    // });
    const fetchInitialData = async () => {
      await fetchCollections({
        variables: {
          first: 100, // Set the desired number of collections to fetch
        },
      });
      setCollectionsFetched(true);
    };
    fetchInitialData()
    const CollectionId = (selectedItem === "Food" ? "gid://shopify/Collection/482348859706" : "gid://shopify/Collection/482348859706");
    const CollectionName = (selectedItem === "Food" ? "Burgers" : "Collections");
    onPressCollection(CollectionId, CollectionName)
    setSelectedCollectionId(CollectionId)

  }, [fetchCollections, selectedItem]);


  useFocusEffect(
    useCallback(() => {
      if (collectionsFetched) {
        fetchProdcutCollection();
      }
    }, [collectionsFetched, selectedItem])
  );

  const fetchProdcutCollection = async () => {
    try {
      const response = await axios.post(
        `https://${STOREFRONT_DOMAIN}/api/2023-04/graphql.json`,
        {
          query: `
          {
            menu(handle: "main-menu") {
              items {
                title
                url
                type
                items {
                  title
                  id
                }
              }
            }
          }
        `,
        },
        {
          headers: {
            'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );
      const filteredItems = response.data.data.menu.items.filter(item =>
        item.title.toLowerCase() === selectedItem.toLowerCase()
      );
      filteredItems.forEach((item) => {
        // console.log(`Items for ${item.title}:`);
        // console.log(item.items);

        let matchedCollectionsArray = [];
        item?.items?.forEach(selectedItem => {
          // console.log("selectedItem title", selectedItem?.title);
          // console.log("Collection", collectionData?.collections?.edges);

          if (collectionData && collectionData.collections && collectionData.collections.edges) {
            let matchedCollection = collectionData.collections.edges.find(collection => {
              return collection?.node?.title === selectedItem?.title;
            });
            // console.log("matchedCollection::::", matchedCollection);
            if (matchedCollection) {
              matchedCollectionsArray.push(matchedCollection.node);
            }
          }
        });

        // console.log("matchedmenu:::::", matchedCollectionsArray);
        setShopifyCollection(matchedCollectionsArray);
      });
    } catch (error) {
      console.log('Error fetching main menu:', error);
    }
  };

  //onPressCollection
  const onPressCollection = (id: any, title: string) => {
    setCollectionTitle(title)
    setSelectedCollectionId(id)
    setLoading(true)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Shopify-Access-Token", ADMINAPI_ACCESS_TOKEN);
    const graphql = JSON.stringify({
      query: `query MyQuery {
        collection(id: "${id}") {
          products(first: 10) {
            nodes {
              id
              images(first: 10) {
                nodes {
                  src
                  url
                }
              }
              title
              description
              vendor
              tags
              options(first:10){
                id
                name
                values
              }
              variants(first: 10) {
                nodes {
                  price
                  inventoryQuantity
                  id
                  title
                  image {
                    originalSrc
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {}
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
      redirect: "follow"
    };
    fetch(`https://${STOREFRONT_DOMAIN}/admin/api/2024-04/graphql.json`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const fetchedProducts = JSON.parse(result);
        // console.log(fetchedProducts.data.collection.products.nodes[0].variants, "fetchedProducts.data")
        setProducts(fetchedProducts?.data?.collection?.products.nodes);
        setLoading(false)
        const inventoryQuantities = fetchedProducts?.data?.collection?.products?.nodes?.map((productEdge) => {
          return productEdge?.variants?.nodes?.map((variants) => variants?.inventoryQuantity);
        });
        setInventoryQuantities(inventoryQuantities)
        // Check and set tags
        const fetchedTags = fetchedProducts?.data?.collection?.products?.nodes.map(productEdge => productEdge.tags);
        setTags(fetchedTags);

        // Check and set options
        const fetchedOptions = fetchedProducts?.data?.collection?.products?.nodes.map(product => product.options);
        setOptions(fetchedOptions);


        const productVariantData = fetchedProducts?.data?.collection?.products?.nodes.map(productEdge => {
          return productEdge?.variants?.nodes.map(variant => ({
            id: variant?.id,
            title: variant?.title,
            inventoryQty: variant?.inventoryQuantity,
            image: variant?.image
          }));
        });
        setProductVariantsIDS(productVariantData)
        console.log(id)
      })

      .catch((error) => {
        setLoading(false)
        console.log("error", error)
      }
      );
    // logEvent(`${heading} Collection Pressed from Catalog Screen`);
    // navigation.navigate('Collections', { id: id, headingText: heading, from: "catalog" })
  }

  function getVariant(node: ShopifyProduct) {
    return node?.variants?.nodes;
  }

  //Add to cart Product
  const addToCartProduct = async (variantId: any, quantity: any) => {
    logEvent(`Add To Cart Pressed variantId:${variantId} Qty:${quantity}`);
    await addToCart(variantId, quantity);
    // navigation.navigate('CartModal')
    Toast.show(`${quantity} item${quantity !== 1 ? 's' : ''} added to cart`);
  };

  return (
    // <ImageBackground style={[flex]} source={BACKGROUND_IMAGE}>
    <ImageBackground style={[flex, { backgroundColor: themecolors.whiteColor }]} source={isDarkMode ? '' : BACKGROUND_IMAGE}>
      <Header
        navigation={navigation}
        backIcon={true}
        // textinput={true}
        text={collectionTitle}
      />
      <View style={[styles.container]}>
        <View style={[styles.productCollectionBox, { backgroundColor: isDarkMode ? themecolors.grayColor : lightGrayOpacityColor }]}>
          <FlatList
            data={shopifyCollection}
            renderItem={({ item }) => (
              <Pressable onPress={() => onPressCollection(item?.id, item?.title)} style={[alignItemsCenter, borderRadius10, { flexDirection: 'row', paddingHorizontal: selectedCollectionId === item?.id ? 0 : spacings.large }]}>
                {selectedCollectionId === item?.id && <View style={{ width: 5, backgroundColor: redColor, height: hp(10), borderTopRightRadius: 10, borderBottomRightRadius: 10, marginBottom: 25 }}>
                </View>}
                <View style={{ height: 'auto', padding: selectedCollectionId === item?.id ? spacings.small : spacings.normal, alignItems: "center", justifyContent: "center", }}>
                  <View style={{
                    backgroundColor: whiteColor, borderWidth: selectedCollectionId === item?.node?.id ? 0 : .5,
                    paddingVertical: spacings.medium, borderRadius: 10, height: hp(10), borderColor: selectedCollectionId === item?.id ? redColor : themecolors.mediumGray
                  }}>
                    <Image source={{ uri: item?.image?.url }} style={[resizeModeContain, styles.card]} />
                  </View>
                  <Text style={[styles.categoryName, textAlign, { color: selectedCollectionId === item?.id ? redColor : themecolors.blackColor }]}>{item?.title}</Text>
                </View>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(index) => index.toString()}
          />
        </View>
        <View style={[styles.productDetailsBox]}>
          {!loading ? <>
            <Text style={{ fontWeight: style.fontWeightThin1x.fontWeight, color: themecolors.blackColor, fontSize: style.fontSizeNormal2x.fontSize, padding: spacings.large }}>
              <Text style={{ fontWeight: style.fontWeightMedium1x.fontWeight, color: themecolors.blackColor, fontSize: style.fontSizeNormal2x.fontSize, padding: spacings.large }}>{products?.length} items
              </Text> in {collectionTitle}</Text>
            <FlatList
              data={products}
              renderItem={({ item, index }) => {
                return (
                  <Product
                    key={item?.id}
                    product={item}
                    onAddToCart={addToCartProduct}
                    loading={addingToCart?.has(getVariant(item)?.id ?? '')}
                    inventoryQuantity={inventoryQuantities[index]}
                    option={options[index]}
                    ids={productVariantsIDS[index]}
                    width={wp(36.5)}
                    onPress={() => {
                      navigation.navigate('ProductDetails', {
                        product: item,
                        variant: getVariant(item),
                        inventoryQuantity: inventoryQuantities[index],
                        tags: tags[index],
                        option: options[index],
                        ids: productVariantsIDS[index]
                      });
                    }}
                  />
                );
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item?.id}
              numColumns={2}
            />
          </>
            :
            <View style={[alignJustifyCenter, { height: hp(52) }]}>
              {/* <ActivityIndicator size={'small'} color={blackColor} /> */}
              <LoaderKit
                style={{ width: 50, height: 50 }}
                name={LOADER_NAME}
                color={themecolors.blackColor}
              />
            </View>
          }
        </View>
      </View>

    </ImageBackground>

  );
}

export default CatalogScreen;

function createStyles() {
  return StyleSheet.create({
    container: {
      width: wp(100),
      height: hp(90),
      // padding: spacings.xLarge,
      // backgroundColor: whiteColor,
      flexDirection: "row"
    },
    productCollectionBox: {
      width: "23%",
      height: hp(88),
      paddingVertical: spacings.small,
      backgroundColor: lightGrayOpacityColor
    },
    productDetailsBox: {
      width: wp(78),
      height: hp(88),
      padding: spacings.small,
    },
    card: {
      width: wp(15.5),
      height: hp(8),
      // paddingVertical: spacings.small
    },
    categoryName: {
      fontSize: style.fontSizeNormal.fontSize,
      color: blackColor,
      marginVertical: spacings.small,
      fontWeight: style.fontWeightThin1x.fontWeight,
      // fontFamily: 'GeneralSans-Variable'
    },
    text: {
      fontSize: style.fontSizeLarge.fontSize,
      fontWeight: style.fontWeightThin1x.fontWeight,
      color: blackColor,
    },
    drinkBannerBox: {
      width: wp(40.5),
      height: hp(20),
      margin: spacings.large,
    }

  });
}
