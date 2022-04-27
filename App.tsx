import React, { useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    ImageRequireSource,
    PanResponder,
    SafeAreaView,
    Text
} from "react-native";

export const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const data = [{ id: 1, img: require("./src/demo.jpg") },
    { id: 2, img: require("./src/demo2.jpg") },
    { id: 3, img: require("./src/demo3.jpg") },
    { id: 4, img: require("./src/demo4.jpg") }
];

let _index = 0;

function App() {

    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
            // console.log(gestureState, event);
            console.log("onPanResponderMove", _index);
            animatedValue.setValue({ x: gestureState.dx + (_index * WINDOW_WIDTH), y: gestureState.dy });
        },
        onPanResponderRelease: (event, gestureState) => {
            // console.log(gestureState, event);
            // animatedValue.setValue({ x: 0, y: 0 });
            console.log("onPanResponderRelease", _index);

            if (gestureState.dx > (WINDOW_WIDTH * 0.25)) {
                // swipe left
                // console.log("swipe left");
                _index++;
                Animated.timing(animatedValue, {
                    toValue: { x: (WINDOW_WIDTH * Math.abs(_index)), y: 0 },
                    useNativeDriver: false,
                    easing: Easing.ease,
                    duration: 300
                }).start();
            }

            if (gestureState.dx < -(WINDOW_WIDTH * 0.25)) {
                // swipe right
                _index--;
                console.log("swipe right", _index, Math.abs(_index), -(WINDOW_WIDTH * Math.abs(_index)));
                Animated.timing(animatedValue, {
                    toValue: { x: -(WINDOW_WIDTH * Math.abs(_index)), y: 0 },
                    useNativeDriver: false,
                    easing: Easing.ease,
                    duration: 300
                }).start();

            } else {
                Animated.timing(animatedValue, {
                    toValue: { x: -(WINDOW_WIDTH * Math.abs(_index)), y: 0 },
                    useNativeDriver: false,
                    easing: Easing.elastic(2.5),
                    duration: 600
                }).start();
            }

        }
    })).current;


    const animatedValue = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    function card(index: number, data: { id: number, img: ImageRequireSource }) {
        console.log(index);

        const cardAnimation = {
            transform: [
                { translateX: animatedValue.x },
                { translateY: 0 },
                { rotate: "0deg" }
            ]
        };

        return <Animated.View
            key={data.id}
            style={{ ...cardAnimation, width: WINDOW_WIDTH, height: WINDOW_HEIGHT, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 23 }}>{data.id}</Text>
            <Image source={data.img}
                   style={{ width: "90%", height: "90%", resizeMode: "contain" }} />
        </Animated.View>;
    }


    return <SafeAreaView
        style={{ flex: 1, backgroundColor: "#eab676", flexDirection: "row" }} {...panResponder.panHandlers}>

        {data.map((item, index) => {
            return card(index, item);
        })}

    </SafeAreaView>;
}

export default React.memo(App);
