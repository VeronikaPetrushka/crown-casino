import { View } from "react-native"
import Signup from "../components/Signup"

const SignupScreen = ({ route }) => {
    const { item = null, sign = null } = route.params || {};

    return (
        <View style={styles.container}>
            <Signup item={item} sign={sign} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
    menu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }
}

export default SignupScreen;