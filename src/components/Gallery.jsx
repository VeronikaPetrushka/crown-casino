import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, ScrollView, ImageBackground } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import gallery from '../constants/gallery';
import Icons from './Icons';

const { height } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const Gallery = () => {
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

    const addToFavorites = async (item) => {
        try {
            const updatedFavorites = [...favorites, item];
            setFavorites(updatedFavorites);

            await AsyncStorage.setItem('favoriteGallery', JSON.stringify(updatedFavorites));
            console.log('Item added to favorites!');
        } catch (error) {
            console.error('Error adding item to favorites:', error);
        }
    };

    const removeFromFavorites = async (item) => {
        try {
            const updatedFavorites = favorites.filter(fav => fav.name !== item.name);
            setFavorites(updatedFavorites);

            await AsyncStorage.setItem('favoriteGallery', JSON.stringify(updatedFavorites));
            console.log('Item removed from favorites!');
        } catch (error) {
            console.error('Error removing item from favorites:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [])
    );

    const isFavorite = (item) => {
        return favorites.some(fav => fav.name === item.name);
    };

    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>

                <View style={styles.upperContainer}>
                    <Text style={styles.title}>Crowns gallery</Text>
                    <TouchableOpacity style={styles.favBtn} onPress={() => navigation.navigate('FavsGalleryScreen')}>
                        <Icons type={'fav'} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{width: '100%'}}>
                    {
                        gallery.map((item, index) => (
                            <TouchableOpacity key={index} style={{width: '100%', marginBottom: 24}} onPress={() => navigation.navigate('GalleryDetailsScreen', {item: item})}>
                                <Image source={item.image} style={styles.image} />

                                <Text style={{color: '#f7d671'}}>{item.name}</Text>
                                <TouchableOpacity 
                                    style={styles.itemToolIcon} 
                                    onPress={() => isFavorite(item) ? removeFromFavorites(item) : addToFavorites(item)}
                                    >
                                    <Icons type={isFavorite(item) ? 'fav-black' : 'fav'} active={isFavorite(item)}  />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 16,
        paddingTop: height * 0.07,
        paddingBottom: 85,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    upperContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 25,
    },

    title: {
        fontWeight: '900',
        fontSize: 28,
        lineHeight: 33.41,
        color: '#f7d671'
    },

    favBtn: {
        width: 28,
        height: 24
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
        top: 16,
        right: 16,
    },

    description: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 19,
        color: '#f7d671',
    },

});

export default Gallery;
