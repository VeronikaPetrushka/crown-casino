import { View } from "react-native"
import Gallery from "../components/Gallery"
import Menu from "../components/Menu";

const GalleryScreen = () => {
    return (
        <View style={styles.container}>
            <Gallery />
            <View style={styles.menu}>
                <Menu />
            </View>
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

export default GalleryScreen;