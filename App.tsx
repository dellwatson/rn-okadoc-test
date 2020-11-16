/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";


import Slide from "./Slide";
import { title } from 'process';
import content from './content'

const { width } = Dimensions.get("window");
const slides = content.slides
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    padding: '25%',
    alignItems: "center",

  }
});

const Fluid = () => {
  const x = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.root}>
      <View style={[StyleSheet.absoluteFillObject, styles.titleContainer]}>
        <Text style={{ fontWeight: '300', fontSize: 20, textAlign: 'center' }}>{content.title}</Text>
      </View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {slides.map((slide, index) => {
          const isFirst = index === 0;
          const isLast = index === slides.length - 1;
          return (
            <View key={index} style={styles.container}>
              <Slide
                x={x}
                index={index}
                aspectRatio={slide.aspectRatio}
                colors={[
                  isFirst ? slide.color : slides[index - 1].color,
                  slide.color,
                  isLast ? slide.color : slides[index + 1].color,
                ]}
                {...slide}
              />
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};


export default () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Fluid />
    </>
  );
};


