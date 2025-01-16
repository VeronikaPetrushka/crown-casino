import { View } from "react-native"
import FavsGallery from "../components/FavsGallery"

const FavsGalleryScreen = () => {
    return (
        <View style={styles.container}>
            <FavsGallery />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default FavsGalleryScreen;