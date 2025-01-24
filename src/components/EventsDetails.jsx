import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, ScrollView , ImageBackground } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const EventsDetails = ({ item }) => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favoriteEvents');
            const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            setFavorites(parsedFavorites);
        } catch (error) {
            console.error('Error retrieving favorites:', error);
        }
    };

    const addToFavorites = async (item) => {
        try {
            const updatedFavorites = [...favorites, item];
            setFavorites(updatedFavorites);

            await AsyncStorage.setItem('favoriteEvents', JSON.stringify(updatedFavorites));
            console.log('Crown added to favorites!');
        } catch (error) {
            console.error('Error adding crown to favorites:', error);
        }
    };

    const removeFromFavorites = async (item) => {
        try {
            const updatedFavorites = favorites.filter(fav => fav.name !== item.name);
            setFavorites(updatedFavorites);

            await AsyncStorage.setItem('favoriteEvents', JSON.stringify(updatedFavorites));
            console.log('Crown removed from favorites!');
        } catch (error) {
            console.error('Error removing crown from favorites:', error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const isFavorite = (item) => {
        return favorites.some(fav => fav.name === item.name);
    };

    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>

                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                        <Icons type={'back'} />
                </TouchableOpacity>

                <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.image} />

                <View style={styles.headingContainer}>
                    <Text style={styles.heading}>{item.name || item.heading}</Text>
                    <TouchableOpacity 
                        style={styles.itemToolIcon} 
                        onPress={() => isFavorite(item) ? removeFromFavorites(item) : addToFavorites(item)}
                        >
                        <Icons type={isFavorite(item) ? 'fav-black' : 'fav'} active={isFavorite(item)} />
                    </TouchableOpacity>
                </View>

                <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 16, marginBottom: 24}}>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text style={styles.date}>{item.time}</Text>
                </View>


                <ScrollView style={{width: '100%', paddingHorizontal: 16}}>
                {
                    item.description && (
                        Array.isArray(item.description) ? (
                            item.description.map((desc, i) => (
                                <Text key={i} style={styles.description}>{desc}</Text>
                            ))
                        ) : (
                            <Text style={styles.description}>{item.description}</Text>
                        )
                    )
                }

                <View style={{height: 85}} />

                </ScrollView>

                <View style={styles.signBtnContainer}>
                    <TouchableOpacity style={styles.signBtn} onPress={() => navigation.navigate('SignupScreen', {item: item})}>
                        <Text style={styles.signBtnText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    back: {
        width: 28,
        height: 24,
        backgroundColor: '#f7d671',
        position: 'absolute',
        top: height * 0.07,
        left: 16,
        zIndex: 10
    },

    image: {
        width: '100%',
        height: 323,
        marginBottom: 12,
        resizeMode: 'cover'
    },

    headingContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 16
    },

    heading: {
        fontWeight: '700',
        fontSize: 34,
        lineHeight: 41,
        color: '#f7d671',
        width: '85%',
    },

    itemToolIcon: {
        width: 28,
        height: 24
    },

    date: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 19,
        color: '#f7d671',
        opacity: 0.5
    },

    description: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 19,
        color: '#f7d671',
        marginBottom: 24
    },

    signBtnContainer: {
        width: '100%', 
        padding: 16, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#120900',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center'
    },

    signBtn: {
        width: '100%',
        backgroundColor: '#301901',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16.5
    },

    signBtnText: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 19,
        color: '#f7d671',
    },

});

export default EventsDetails;
