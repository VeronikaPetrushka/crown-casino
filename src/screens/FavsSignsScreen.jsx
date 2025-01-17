import { View } from "react-native"
import FavsSigns from "../components/FavsSigns"

const FavsSignsScreen = () => {
    return (
        <View style={styles.container}>
            <FavsSigns />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default FavsSignsScreen;