import { View } from "react-native"
import FavsEvents from "../components/FavsEvents"

const FavsEventsScreen = () => {
    return (
        <View style={styles.container}>
            <FavsEvents />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default FavsEventsScreen;