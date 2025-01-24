import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, ScrollView, ImageBackground } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const FavsSigns = () => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favoriteSigns');
            const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            setFavorites(parsedFavorites);
        } catch (error) {
            console.error('Error retrieving favorites:', error);
        }
    };

    const removeFromFavorites = async (item) => {
        try {
            const updatedFavorites = favorites.filter(fav => fav.name !== item.name);
            setFavorites(updatedFavorites);

            await AsyncStorage.setItem('favoriteSigns', JSON.stringify(updatedFavorites));
            console.log('Crown removed from favorites!');
        } catch (error) {
            console.error('Error removing crown from favorites:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [])
    );

    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                        <Icons type={'back'} active />
                    </TouchableOpacity>
                    <Text style={styles.title}>Your Favorites</Text>
                </View>

                {favorites.length > 0 ? (
                    <ScrollView style={{ width: '100%'}}>
                        {favorites.map((item, index) => (
                        <TouchableOpacity key={index} style={{width: '100%', marginBottom: 24}} onPress={() => navigation.navigate('EventsDetailsScreen', {item: item})}>
                                <Text style={styles.date}>{item.item.date}</Text>
                                <Image source={typeof item.item.image === 'string' ? { uri: item.item.image } : item.item.image} style={styles.image} />

                                <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                                    <Text style={{color: '#f7d671'}}>{item.item.name || item.item.heading}</Text>
                                    <Text style={styles.time}>{item.item.time}</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.itemToolIcon} 
                                    onPress={() => removeFromFavorites(item)}
                                    >
                                    <Icons type={'fav-black'} active />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <View style={styles.noContainer}>
                        <View style={styles.noImage}>
                            <Icons type={'1'} active />
                        </View>
                        <Text style={styles.noText}>You don't have any favorite registrations yet.</Text>
                        <TouchableOpacity style={styles.noAddBtn} onPress={() => navigation.goBack('')}>
                            <Text style={styles.noAddBtnText}>Go to Reservations</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
        paddingTop: height * 0.07
    },

    back: {
        width: 44,
        height: 44,
        marginRight: 16
    },

    upperContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24
    },

    image: {
        width: '100%',
        height: 177,
        marginBottom: 12,
        resizeMode: 'cover'
    },

    title: {
        fontWeight: '900',
        fontSize: 28,
        lineHeight: 33.41,
        color: '#f7d671',
    },

    itemToolIcon: {
        width: 28,
        height: 24,
        position: 'absolute',
        top: 46,
        right: 16,
    },

    date: {
        fontWeight: '600',
        fontSize: 17,
        lineHeight: 20.29,
        color: '#f7d671',
        marginBottom: 12
    },

    time: {
        fontWeight: '300',
        fontSize: 12,
        lineHeight: 14.32,
        color: '#f7d671',
        opacity: 0.5
    },
    
    noContainer: {
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20%'
    },

    noImage: {
        width: 80,
        height: 80,
        marginBottom: 24,
    },

    noText: {
        fontWeight: '400',
        fontSize: 13,
        lineHeight: 15,
        color: '#f7d671',
        textAlign: 'center',
        marginBottom: 24
    },

    noAddBtn: {
        width: 170,
        padding: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#f7d671',
        backgroundColor: '#f7d671'
    },

    noAddBtnText: {
        fontWeight: '300',
        fontSize: 12,
        lineHeight: 14.32,
        color: '#000',
    },

});

export default FavsSigns;
