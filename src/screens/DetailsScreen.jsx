import { View } from "react-native"
import Details from "../components/Details"

const DetailsScreen = ({ route }) => {
    const { crown } = route.params;
    return (
        <View style={styles.container}>
            <Details crown={crown} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default DetailsScreen;