import React, { useState, useEffect } from "react";
import { Dimensions, Image, StyleSheet, View, Text, TextInput, Alert } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import {
  interpolateColor,
  cartesian2Canvas,
  Vector,
  serialize,
  createPath,
  addCurve,
} from "react-native-redash";

const { width } = Dimensions.get("window");
const RATIO = 0.9;
const SIZE = width * RATIO;
const C = 0.551915024494;
const CENTER = { x: 1, y: 1 };

const vec = (x: number, y: number) => cartesian2Canvas({ x, y }, CENTER);
const addX = (v: Vector, x: number) => {
  "worklet";
  return { x: v.x + x, y: v.y };
};
const P00 = vec(0, 1);
const P01 = vec(C, 1);
const P02 = vec(1, C);
const P03 = vec(1, 0);

//const P10 = vec(1, 0);
const P11 = vec(1, -C);
const P12 = vec(C, -1);
const P13 = vec(0, -1);

// const P20 = vec(0, -1);
const P21 = vec(-C, -1);
const P22 = vec(-1, -C);
const P23 = vec(-1, 0);

// const P30 = vec(-1, 0);
const P31 = vec(-1, C);
const P32 = vec(-C, 1);
const P33 = vec(0, 1);

interface SlideProps {
  x: Animated.SharedValue<number>;
  index: number;
  colors: [string, string, string];
  aspectRatio: number;
  children?: any;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default Slide = ({ x, index, colors, aspectRatio, ...props }: SlideProps) => {
  const animatedProps = useAnimatedProps(() => {
    const progress = (x.value - width * index) / width;
    const offset = interpolate(progress, [0, 1], [0, -2], Extrapolate.CLAMP);
    const path = createPath({ x: P00.x + offset, y: P00.y });
    addCurve(path, {
      c1: addX(P01, offset),
      c2: P02,
      to: P03,
    });
    addCurve(path, {
      c1: P11,
      c2: addX(P12, offset),
      to: addX(P13, offset),
    });
    addCurve(path, {
      c1: addX(P21, offset),
      c2: {
        x:
          interpolate(
            progress,
            [(-1 * RATIO) / 2, 0],
            [1, 0],
            Extrapolate.CLAMP
          ) + offset,
        y: P22.y,
      },
      to: {
        x:
          interpolate(
            progress,
            [(-1 * RATIO) / 2, 0],
            [1, 0],
            Extrapolate.CLAMP
          ) + offset,
        y: P23.y,
      },
    });
    addCurve(path, {
      c1: {
        x:
          interpolate(
            progress,
            [(-1 * RATIO) / 2, 0],
            [1, 0],
            Extrapolate.CLAMP
          ) + offset,
        y: P31.y,
      },
      c2: addX(P32, offset),
      to: addX(P33, offset),
    });
    return {
      d: serialize(path),
      fill: interpolateColor(progress, [-1, 0, 1], colors),
    };
  });
  return (
    <View>
      <Svg width={SIZE} height={SIZE} viewBox="0 0 2 2">
        <AnimatedPath fill="#D5E4FF" animatedProps={animatedProps} />
      </Svg>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box {...props} {...{ index }} />
      </View>
    </View>
  );
};

const defaultInput = {
  x: null,
  y: null,
}



const Box = ({ title, index }: any) => {
  const [result, setResult] = useState<{}>('Result will show here...')
  const [input, setInput] = useState(defaultInput)
  const isFirstN = index > 1

  useEffect(() => {
    if (index === 0) {
      setResult(Number(input.x) + Number(input.y))
    }
    if (index === 1) {
      setResult(Number(input.x) * Number(input.y))
    }
    if (index === 2) {
      setResult(getNprimes(Number(input.x)).join(','))
    }
    if (index === 3) {
      console.log('hello here')
      setResult(getFibonnaci(Number(input.x)).join(','))
    }

  }, [input])

  //detect index change flush

  return (
    <View style={{
      backgroundColor: 'white', borderRadius: 10,
      width: '90%',
      paddingHorizontal: '15%',
      paddingVertical: '1%',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,

    }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: '8%', textAlign: 'center' }}>{title}</Text>
      <Text style={{ fontSize: 20, marginVertical: '15%', overflow: 'hidden', flexWrap: 'nowrap' }}>Result: {result}</Text>
      <View style={{ flexDirection: 'row', marginVertical: '5%' }}>
        <Input {...{ title: isFirstN ? `N` : 'X', input, setResult, setInput: (o: number) => setInput({ ...input, x: o }) }} />
        {!isFirstN && <Input {...{ title: 'Y', input, setResult, setInput: (o: number) => setInput({ ...input, y: o }) }} />}
      </View>
    </View >
  )
}

const Input = ({ title, setInput, input }: any) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold', }}>{title}</Text>
    <TextInput
      keyboardType='numeric'
      style={{
        height: 40,
        borderRadius: 5,
        borderColor: 'gray', borderWidth: 1,
        minWidth: 100, textAlign: 'center'
      }}
      onChangeText={text => {
        if (!Number(text) && text !== '') {
          setInput(0)
          return alert('Only number')
        }

        if (title === 'N' && Number(text) > 300) {
          setInput(0)
          return alert('kebanyakan masbro, dibawah 300 aja ya')
        } else {
          setInput(text)
        }
      }}

      value={input}
    />
  </View>
)


export const getNprimes = (n) => {
  const arr = [];
  let i = 2

  while (arr.length < n) {
    if (isPrime(i)) {
      arr.push(i)
    }
    i++
  }
  return arr;

  function isPrime(n) {
    if (n < 2) {
      return false
    }

    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        return false;
      }
    }
    return true
  }
}

export const getFibonnaci = n =>
  [...Array(n)].reduce(
    (acc, val, i) => acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i),
    []
  )