import { View, Dimensions } from "react-native"
import AddCrown from "../components/AddCrown"

const AddCrownScreen = () => {
    return (
        <View style={styles.container}>
            <AddCrown />
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

export default AddCrownScreen;