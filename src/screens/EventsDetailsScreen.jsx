import { View } from "react-native"
import EventsDetails from "../components/EventsDetails"

const EventsDetailsScreen = ({ route }) => {
    const { item } = route.params;
    return (
        <View style={styles.container}>
            <EventsDetails item={item} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default EventsDetailsScreen;