import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const Menu = () => {
    const navigation = useNavigation();
    const [activeButton, setActiveButton] = useState('HomeScreen');

    const handleNavigate = (screen) => {
        setActiveButton(screen);
        navigation.navigate(screen)
    };    

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const currentRoute = navigation.getState().routes[navigation.getState().index].name;
            setActiveButton(currentRoute);
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>

            <View style={styles.btnContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('HomeScreen')}>
                    <Icons type={'1'} active={activeButton === 'HomeScreen'}/>
                </TouchableOpacity>
                <Text style={[styles.btnText, activeButton === 'HomeScreen' && {color: '#f7d671'}]}>Home</Text>
            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('GalleryScreen')}>
                    <Icons type={'2'} active={activeButton === 'GalleryScreen'}/>
                </TouchableOpacity>
                <Text style={[styles.btnText, activeButton === 'GalleryScreen' && {color: '#f7d671'}]}>Gallery</Text>
            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('EventsScreen')}>
                    <Icons type={'3'} active={activeButton === 'EventsScreen'}/>
                </TouchableOpacity>
                <Text style={[styles.btnText, activeButton === 'EventsScreen' && {color: '#f7d671'}]}>Events</Text>
            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleNavigate('ProfileScreen')}>
                    <Icons type={'4'} active={activeButton === 'ProfileScreen'}/>
                </TouchableOpacity>
                <Text style={[styles.btnText, activeButton === 'ProfileScreen' && {color: '#f7d671'}]}>Profile</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingVertical: 20,
        flexDirection: 'row',
        backgroundColor: '#120900',
        alignSelf: "center",
    },
    
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 32,
        height: 32,
    },
    btnText: {
        fontWeight: '600',
        fontSize: 10,
        color: '#999',
        marginTop: 8
    }
});

export default Menu;
