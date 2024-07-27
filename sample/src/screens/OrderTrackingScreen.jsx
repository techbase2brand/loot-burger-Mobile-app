// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ImageBackground } from 'react-native';
// import Header from '../components/Header';
// import { BACKGROUND_IMAGE, DELIVER_BOY_IMAGE } from '../assests/images';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import { spacings, style } from '../constants/Fonts';
// import { BaseStyle } from '../constants/Style';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
// import { useThemes } from '../context/ThemeContext';
// import { lightColors, darkColors } from '../constants/Color';
// import { useNavigation } from '@react-navigation/native';
// import LoaderKit from 'react-native-loader-kit';
// import { LOADER_NAME } from '../constants/Constants';
// import axios from 'axios';

// const { flex, alignJustifyCenter } = BaseStyle;

// const OrderTrackingScreen = ({ route }) => {
//   const navigation = useNavigation();
//   const { orderId, orderStatus } = route.params;
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { isDarkMode } = useThemes();
//   const colors = isDarkMode ? darkColors : lightColors;

//   // Replace with actual start location
//   const orderPickupLocation = {
//     latitude: 37.79825,
//     longitude: -122.4324,
//   };

//   // Replace with actual end location
//   const orderDeliverLocation = {
//     latitude: 37.78925,
//     longitude: -122.4264,
//   };

//   useEffect(() => {
//     const fetchOrderDetails = async (orderId) => {
//       try {
//         const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
//           params: {
//             origin: `${orderPickupLocation.latitude},${orderPickupLocation.longitude}`,
//             destination: `${orderDeliverLocation.latitude},${orderDeliverLocation.longitude}`,
//             key: 'AIzaSyBXNyT9zcGdvhAUCUEYTm6e_qPw26AOPgI', // Replace with your API key
//             mode: 'driving', // or 'walking', 'transit'
//           },
//         });

//         const steps = response.data.routes[0].legs[0].steps;
//         const pathCoordinates = steps.map(step => ({
//           latitude: step.end_location.lat,
//           longitude: step.end_location.lng,
//         }));

//         // Include start and end locations in pathCoordinates
//         pathCoordinates.unshift({
//           latitude: response.data.routes[0].legs[0].start_location.lat,
//           longitude: response.data.routes[0].legs[0].start_location.lng,
//         });
//         pathCoordinates.push({
//           latitude: response.data.routes[0].legs[0].end_location.lat,
//           longitude: response.data.routes[0].legs[0].end_location.lng,
//         });

//         setOrderDetails({
//           id: orderId,
//           status: orderStatus,
//           startingLocation: orderPickupLocation,
//           deliveryLocation: orderDeliverLocation,
//           pathCoordinates,
//         });

//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     };

//     fetchOrderDetails(orderId);
//   }, [orderId]);

//   if (loading) {
//     return (
//       <ImageBackground style={[styles.container, alignJustifyCenter, flex, { backgroundColor: colors.whiteColor }]} source={isDarkMode ? '' : BACKGROUND_IMAGE}>
//         <LoaderKit style={{ width: 50, height: 50 }} name={LOADER_NAME} color={colors.blackColor} />
//       </ImageBackground>
//     );
//   }

//   return (
//     <ImageBackground style={[flex, { backgroundColor: colors.whiteColor }]} source={isDarkMode ? '' : BACKGROUND_IMAGE}>
//       <Header backIcon={true} text={"OrderTracking"} navigation={navigation} />
//       <Text style={[styles.title, { color: colors.blackColor }]}>Tracking Order : {orderId}</Text>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: orderDetails.deliveryLocation.latitude,
//           longitude: orderDetails.deliveryLocation.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         <Marker
//           coordinate={orderDetails.startingLocation}
//           title="Start Location"
//           description={`Order ID : ${orderDetails.id}`}

//         />
//         <Marker
//           coordinate={orderDetails.deliveryLocation}
//           title="Delivery Location"
//           description={`Order ID : ${orderDetails.id}`}
//         />
//         {orderDetails.pathCoordinates && (
//           <Polyline
//             coordinates={orderDetails.pathCoordinates}
//             strokeColor={colors.redColor}
//             strokeWidth={5}
//           />
//         )}
//       </MapView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   map: {
//     width: wp(100),
//     height: hp(83.3),
//   },
//   title: {
//     fontSize: style.fontSizeMedium.fontSize,
//     fontWeight: style.fontWeightThin1x.fontWeight,
//     marginBottom: spacings.large,
//     paddingHorizontal: spacings.large,
//   },
// });

// export default OrderTrackingScreen;


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import Header from '../components/Header';
import { BACKGROUND_IMAGE, DELIVER_BOY_IMAGE } from '../assests/images';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { useThemes } from '../context/ThemeContext';
import { lightColors, darkColors } from '../constants/Color';
import { useNavigation } from '@react-navigation/native';
import LoaderKit from 'react-native-loader-kit';
import { LOADER_NAME } from '../constants/Constants';
import axios from 'axios';

const { flex, alignJustifyCenter } = BaseStyle;

const OrderTrackingScreen = ({ route }) => {
  const navigation = useNavigation();
  const { orderId, orderStatus } = route.params;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);
  const { isDarkMode } = useThemes();
  const colors = isDarkMode ? darkColors : lightColors;

  const orderPickupLocation = {
    latitude: 37.79828,
    longitude: -122.4327,
  };

  const orderDeliverLocation = {
    latitude: 37.79925,
    longitude: -122.4364,
  };

  // const orderPickupLocation = {
  //   latitude: 37.79825,
  //   longitude: -122.4324,
  // };

  // const orderDeliverLocation = {
  //   latitude: 37.78925,
  //   longitude: -122.4264,
  // };


  useEffect(() => {
    const fetchOrderDetails = async (orderId) => {
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
          params: {
            origin: `${orderPickupLocation.latitude},${orderPickupLocation.longitude}`,
            destination: `${orderDeliverLocation.latitude},${orderDeliverLocation.longitude}`,
            key: 'AIzaSyBXNyT9zcGdvhAUCUEYTm6e_qPw26AOPgI', // Replace with your API key
            mode: 'driving',
          },
        });

        const steps = response.data.routes[0].legs[0].steps;
        const pathCoordinates = steps.map(step => ({
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        }));

        pathCoordinates.unshift({
          latitude: response.data.routes[0].legs[0].start_location.lat,
          longitude: response.data.routes[0].legs[0].start_location.lng,
        });
        pathCoordinates.push({
          latitude: response.data.routes[0].legs[0].end_location.lat,
          longitude: response.data.routes[0].legs[0].end_location.lng,
        });

        setOrderDetails({
          id: orderId,
          status: orderStatus,
          startingLocation: orderPickupLocation,
          deliveryLocation: orderDeliverLocation,
          pathCoordinates,
        });

        setDriverLocation(orderPickupLocation);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchOrderDetails(orderId);
  }, [orderId,]);

  useEffect(() => {
    if (orderDetails && orderDetails.pathCoordinates.length > 0) {
      const moveDriver = async (index) => {
        if (index < orderDetails.pathCoordinates.length - 1) {
          const start = orderDetails.pathCoordinates[index];
          const end = orderDetails.pathCoordinates[index + 1];
          const deltaLat = (end.latitude - start.latitude) / 50;  // Increase divisor for smoother animation
          const deltaLng = (end.longitude - start.longitude) / 50;  // Increase divisor for smoother animation

          let step = 0;
          const intervalId = setInterval(() => {
            step += 1;
            const newLat = start.latitude + deltaLat * step;
            const newLng = start.longitude + deltaLng * step;
            setDriverLocation({ latitude: newLat, longitude: newLng });

            if (step === 50) {  // Increase divisor for smoother animation
              clearInterval(intervalId);
              moveDriver(index + 1);
            }
          }, 2000);  // Adjust interval time as needed
        }
      };

      moveDriver(0);
    }
  }, [orderDetails]);

  if (loading) {
    return (
      <ImageBackground style={[styles.container, alignJustifyCenter, flex, { backgroundColor: colors.whiteColor }]} source={isDarkMode ? '' : BACKGROUND_IMAGE}>
        <LoaderKit style={{ width: 50, height: 50 }} name={LOADER_NAME} color={colors.blackColor} />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground style={[flex, { backgroundColor: colors.whiteColor }]} source={isDarkMode ? '' : BACKGROUND_IMAGE}>
      <Header backIcon={true} text={"OrderTracking"} navigation={navigation} />
      <Text style={[styles.title, { color: colors.blackColor }]}>Tracking Order: {orderId}</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: orderDetails.deliveryLocation.latitude,
          longitude: orderDetails.deliveryLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={orderDetails.startingLocation}
          title="Start Location"
          description={`Order ID: ${orderDetails.id}`}
        />
        <Marker
          coordinate={orderDetails.deliveryLocation}
          title="Delivery Location"
          description={`Order ID: ${orderDetails.id}`}
        />
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Driver Location"
            description="Current Location"
            // image={DELIVER_BOY_IMAGE}
          >
            <View style={styles.driverMarker}>
              <Text style={styles.driverMarkerText}>🛵</Text>
            </View>
            </Marker>
        )}
        {orderDetails.pathCoordinates && (
          <Polyline
            coordinates={orderDetails.pathCoordinates}
            strokeColor={colors.redColor}
            strokeWidth={5}
          />
        )}
      </MapView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  map: {
    width: wp(100),
    height: hp(83.3),
  },
  title: {
    fontSize: style.fontSizeMedium.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    marginBottom: spacings.large,
    paddingHorizontal: spacings.large,
  },
  driverMarker: {
    // backgroundColor: 'blue',
    // padding: 5,
    borderRadius: 10,
  },
  driverMarkerText: {
    color: 'white',
    fontSize: 40,
  },
});

export default OrderTrackingScreen;





// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ImageBackground } from 'react-native';
// import Header from '../components/Header';
// import { BACKGROUND_IMAGE, DELIVER_BOY_IMAGE } from '../assests/images';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import { spacings, style } from '../constants/Fonts';
// import { BaseStyle } from '../constants/Style';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
// import { useThemes } from '../context/ThemeContext';
// import { lightColors, darkColors } from '../constants/Color';
// import { useNavigation } from '@react-navigation/native';
// import LoaderKit from 'react-native-loader-kit';
// import { LOADER_NAME } from '../constants/Constants';
// import axios from 'axios';

// const { flex, alignJustifyCenter } = BaseStyle;

// const OrderTrackingScreen = ({ route }) => {
//   const navigation = useNavigation();
//   const { orderId, orderStatus } = route.params;
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [driverLocation, setDriverLocation] = useState(null);
//   const [coveredPathLength, setCoveredPathLength] = useState(0);
//   const { isDarkMode } = useThemes();
//   const colors = isDarkMode ? darkColors : lightColors;

//   const orderPickupLocation = {
//     latitude: 37.79828,
//     longitude: -122.4327,
//   };

//   const orderDeliverLocation = {
//     latitude: 37.79925,
//     longitude: -122.4364,
//   };

//   useEffect(() => {
//     const fetchOrderDetails = async (orderId) => {
//       try {
//         const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
//           params: {
//             origin: `${orderPickupLocation.latitude},${orderPickupLocation.longitude}`,
//             destination: `${orderDeliverLocation.latitude},${orderDeliverLocation.longitude}`,
//             key: 'AIzaSyBXNyT9zcGdvhAUCUEYTm6e_qPw26AOPgI', // Replace with your API key
//             mode: 'driving',
//           },
//         });

//         const steps = response.data.routes[0].legs[0].steps;
//         const pathCoordinates = steps.map(step => ({
//           latitude: step.end_location.lat,
//           longitude: step.end_location.lng,
//         }));

//         pathCoordinates.unshift({
//           latitude: response.data.routes[0].legs[0].start_location.lat,
//           longitude: response.data.routes[0].legs[0].start_location.lng,
//         });
//         pathCoordinates.push({
//           latitude: response.data.routes[0].legs[0].end_location.lat,
//           longitude: response.data.routes[0].legs[0].end_location.lng,
//         });

//         setOrderDetails({
//           id: orderId,
//           status: orderStatus,
//           startingLocation: orderPickupLocation,
//           deliveryLocation: orderDeliverLocation,
//           pathCoordinates,
//         });

//         setDriverLocation(orderPickupLocation);
//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     };

//     fetchOrderDetails(orderId);
//   }, [orderId]);

//   useEffect(() => {
//     if (orderDetails && orderDetails.pathCoordinates.length > 0) {
//       const moveDriver = async (index) => {
//         if (index < orderDetails.pathCoordinates.length - 1) {
//           const start = orderDetails.pathCoordinates[index];
//           const end = orderDetails.pathCoordinates[index + 1];
//           const deltaLat = (end.latitude - start.latitude) / 50;  // Increase divisor for smoother animation
//           const deltaLng = (end.longitude - start.longitude) / 50;  // Increase divisor for smoother animation

//           let step = 0;
//           const intervalId = setInterval(() => {
//             step += 1;
//             const newLat = start.latitude + deltaLat * step;
//             const newLng = start.longitude + deltaLng * step;
//             setDriverLocation({ latitude: newLat, longitude: newLng });

//             // Calculate covered path length
//             const totalPathLength = getPathLength(orderDetails.pathCoordinates);
//             const coveredPathLength = getPathLength(orderDetails.pathCoordinates.slice(0, index + 1).concat({ latitude: newLat, longitude: newLng }));
//             setCoveredPathLength(coveredPathLength / totalPathLength);

//             if (step === 50) {  // Increase divisor for smoother animation
//               clearInterval(intervalId);
//               moveDriver(index + 1);
//             }
//           }, 2000);  // Adjust interval time as needed
//         }
//       };

//       moveDriver(0);
//     }
//   }, [orderDetails]);

//   const getPathLength = (coordinates) => {
//     let length = 0;
//     for (let i = 0; i < coordinates.length - 1; i++) {
//       const start = coordinates[i];
//       const end = coordinates[i + 1];
//       length += getDistance(start, end);
//     }
//     return length;
//   };

//   const getDistance = (start, end) => {
//     const R = 6371000; // Earth's radius in meters
//     const lat1 = start.latitude * Math.PI / 180;
//     const lat2 = end.latitude * Math.PI / 180;
//     const deltaLat = (end.latitude - start.latitude) * Math.PI / 180;
//     const deltaLng = (end.longitude - start.longitude) * Math.PI / 180;
//     const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//               Math.cos(lat1) * Math.cos(lat2) *
//               Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   if (loading) {
//     return (
//       <ImageBackground style={[styles.container, alignJustifyCenter, flex, { backgroundColor: colors.whiteColor }]} source={isDarkMode ? '' : BACKGROUND_IMAGE}>
//         <LoaderKit style={{ width: 50, height: 50 }} name={LOADER_NAME} color={colors.blackColor} />
//       </ImageBackground>
//     );
//   }

//   // Determine covered path and remaining path coordinates
//   const coveredPathCoordinates = orderDetails.pathCoordinates.slice(0, Math.ceil(orderDetails.pathCoordinates.length * coveredPathLength));
//   const remainingPathCoordinates = orderDetails.pathCoordinates.slice(Math.ceil(orderDetails.pathCoordinates.length * coveredPathLength));

//   return (
//     <ImageBackground style={[flex, { backgroundColor: colors.whiteColor }]} source={isDarkMode ? '' : BACKGROUND_IMAGE}>
//       <Header backIcon={true} text={"OrderTracking"} navigation={navigation} />
//       <Text style={[styles.title, { color: colors.blackColor }]}>Tracking Order: {orderId}</Text>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: orderDetails.deliveryLocation.latitude,
//           longitude: orderDetails.deliveryLocation.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         <Marker
//           coordinate={orderDetails.startingLocation}
//           title="Start Location"
//           description={`Order ID: ${orderDetails.id}`}
//         />
//         <Marker
//           coordinate={orderDetails.deliveryLocation}
//           title="Delivery Location"
//           description={`Order ID: ${orderDetails.id}`}
//         />
//         {driverLocation && (
//           <Marker
//             coordinate={driverLocation}
//             title="Driver Location"
//             description="Current Location"
//             // image={DELIVER_BOY_IMAGE}
//           >
//             <View style={styles.driverMarker}>
//               <Text style={styles.driverMarkerText}>🛵</Text>
//             </View>
//           </Marker>
//         )}
//         <Polyline
//           coordinates={coveredPathCoordinates}
//           strokeColor={colors.grayColor}  // Covered path color
//           strokeWidth={5}
//         />
//         <Polyline
//           coordinates={remainingPathCoordinates}
//           strokeColor={colors.redColor}  // Remaining path color
//           strokeWidth={5}
//         />
//       </MapView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   map: {
//     width: wp(100),
//     height: hp(83.3),
//   },
//   title: {
//     fontSize: style.fontSizeMedium.fontSize,
//     fontWeight: style.fontWeightThin1x.fontWeight,
//     marginBottom: spacings.large,
//     paddingHorizontal: spacings.large,
//   },
//   driverMarker: {
//     padding: 5,
//     borderRadius: 10,
//   },
//   driverMarkerText: {
//     color: 'white',
//     fontSize: 40,
//   },
// });

// export default OrderTrackingScreen;
