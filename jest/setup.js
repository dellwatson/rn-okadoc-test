const mock = jest.requireMock("react-native-reanimated");
jest.mock("react-native-reanimated", () => ({
    ...mock,
    useSharedValue: jest.fn().mockReturnValue(0),
    useAnimatedStyle: jest.fn().mockReturnValue({}),
    useAnimatedScrollHandler: jest.fn().mockReturnValue({}),
    createAnimatedComponent: (component) => jest.fn().mockReturnValue(component),
    __reanimatedWorkletInit: jest.fn(),
    ScrollView: "ScrollView",
}));

global.__reanimatedWorkletInit = jest.fn();