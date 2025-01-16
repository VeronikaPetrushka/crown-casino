import { View } from "react-native"
import GalleryDetails from "../components/GalleryDetails"

const GalleryDetailsScreen = ({ route }) => {
    const { item } = route.params;
    return (
        <View style={styles.container}>
            <GalleryDetails item={item} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default GalleryDetailsScreen;