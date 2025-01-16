import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, ScrollView, Modal } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const FavsGallery = () => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favoriteGallery');
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

            await AsyncStorage.setItem('favoriteGallery', JSON.stringify(updatedFavorites));
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
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                            <Icons type={'back'} />
                </TouchableOpacity>
                <Text style={styles.title}>Your Favorites</Text>
            </View>

            {favorites.length > 0 ? (
                <ScrollView style={{ width: '100%'}}>
                    {favorites.map((item, index) => (
                        <TouchableOpacity key={index} style={{width: '100%', marginBottom: 24}} onPress={() => navigation.navigate('GalleryDetailsScreen', {item: item})}>
                            <TouchableOpacity style={styles.itemToolIcon} onPress={() => removeFromFavorites(item)}>
                                <Icons type={'fav-black'} />
                            </TouchableOpacity>
                            <Image source={item.image} style={styles.image} />
                            <Text style={styles.name}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.noContainer}>
                    <Image source={require('../assets/decor/crown.png')} style={styles.noImage} />
                    <Text style={styles.noText}>You don't have any favorite crowns yet.</Text>
                    <TouchableOpacity style={styles.noAddBtn} onPress={() => navigation.navigate('HomeScreen')}>
                        <Text style={styles.noAddBtnText}>Go to Home</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fdf8ea',
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
        color: '#000',
    },

    itemToolIcon: {
        width: 28,
        height: 24,
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10
    },

    description: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 19,
        color: '#000',
    },

    noContainer: {
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20%'
    },

    noImage: {
        width: 130,
        height: 130,
        marginBottom: 24,
    },

    noText: {
        fontWeight: '400',
        fontSize: 13,
        lineHeight: 15,
        color: '#000',
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
        borderColor: '#000',
        backgroundColor: '#fdf8ea'
    },

    noAddBtnText: {
        fontWeight: '300',
        fontSize: 12,
        lineHeight: 14.32,
        color: '#000',
    },

});

export default FavsGallery;
