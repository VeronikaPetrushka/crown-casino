import { View } from "react-native"
import Events from "../components/Events"
import Menu from "../components/Menu";

const EventsScreen = () => {
    return (
        <View style={styles.container}>
            <Events />
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

export default EventsScreen;