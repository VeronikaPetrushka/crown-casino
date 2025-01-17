import { View } from "react-native"
import Signs from "../components/Signs"

const SignsScreen = () => {
    return (
        <View style={styles.container}>
            <Signs />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default SignsScreen;