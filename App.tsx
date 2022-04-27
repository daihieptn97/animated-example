import * as React from "react";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Animated from "react-native-reanimated";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs/lib/typescript/src/types";
import { useDebounce } from "usehooks-ts";
import { Slider } from "@miblanchard/react-native-slider";

function MyTabBar({ state, descriptors, navigation, position }: MaterialTopTabBarProps) {
    return (
        <View style={{ flexDirection: "row", paddingTop: 20 }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key
                    });
                };
                // modify inputRange for custom behavior
                const inputRange = state.routes.map((_, i) => i);
                // const opacity = Animated.interpolate(position, {
                //     inputRange,
                //     outputRange: inputRange.map((i) => (i === index ? 1 : 0))
                // });

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1 }}
                    >
                        <Animated.Text style={{ opacity: 1 }}>{label}</Animated.Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// let cmd2 = "";

let running = false;
let timeoutId: NodeJS.Timeout | null = null;


function HomeScreen() {
    const [cmd, setCmd] = useState("");
    const [value, setValue] = useState<string>("");
    const debouncedValue = useDebounce<string>(cmd, 500);
    const [sliderValue, setSliderValue] = useState<number>(1);


    // // Fetch API (optional)
    // useEffect(() => {
    //     // Do fetch here...
    //     // Triggers when "debouncedValue" changes
    //
    //     console.log("Fetching...", debouncedValue);
    //
    // }, [debouncedValue]);
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    useEffect(() => {
        console.log("useEffect...", cmd);
    }, [cmd]);

    const onSubmit = () => {
        console.log("Submitting...", new Date().getTime().toString());
        // setValue(new Date().getTime().toString());
    };

    const onSlidingComplete = (e: number | number[]) => {
        console.log("Sliding completed", e);
        if (typeof e === "number") {

        } else {
            // setCmd(JSON.stringify({ "cmd": "set_speed", "speed": e[0], ti`me: new Date().getTime() }));
            // cmd2 = JSON.stringify({ "cmd": "set_speed", "speed": e[0], time: new Date().getTime() });
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                setCmd(JSON.stringify({ "cmd": "set_speed", "speed": e[0], time: new Date().getTime() }));
            }, 500);
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <Text>Home!</Text>


            <TouchableOpacity onPress={onSubmit}>
                <Text>Go to Details</Text>
            </TouchableOpacity>


            <View style={{
                flex: 1,
                marginLeft: 10,
                marginRight: 10
            }}>
                <Slider


                    minimumValue={0}
                    maximumValue={250}

                    value={sliderValue}

                    onValueChange={value => setSliderValue(typeof value === "number" ? value : value[0])}
                    onSlidingComplete={onSlidingComplete}
                />
                <Text>Value: {sliderValue}</Text>
            </View>


        </View>
    );
}

function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Settings!</Text>
        </View>
    );
}

function ProfileScreen() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Profile!</Text>
        </View>
    );
}

const Tab = createMaterialTopTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
                <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
                    <Tab.Screen name="Home" component={HomeScreen} />
                    {/*<Tab.Screen name="Settings" component={SettingsScreen} />*/}
                    {/*<Tab.Screen name="Profile" component={ProfileScreen} />*/}
                </Tab.Navigator>
            </SafeAreaView>
        </NavigationContainer>
    );
}
