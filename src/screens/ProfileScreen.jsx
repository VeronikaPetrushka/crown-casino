import { View } from "react-native"
import Profile from "../components/Profile"
import Menu from "../components/Menu";

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Profile />
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

export default ProfileScreen;