import { View, Dimensions } from "react-native"
import Favs from "../components/Favs"

const FavsScreen = () => {
    return (
        <View style={styles.container}>
            <Favs />
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

export default FavsScreen;