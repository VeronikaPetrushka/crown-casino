import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, ScrollView , ImageBackground } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const GalleryDetails = ({ item }) => {
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
            console.log('Crown added to favorites!');
        } catch (error) {
            console.error('Error adding crown to favorites:', error);
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

                <Image source={item.image} style={styles.image} />

                <View style={styles.headingContainer}>
                    <Text style={styles.heading}>{item.name}</Text>
                    <TouchableOpacity 
                        style={styles.itemToolIcon} 
                        onPress={() => isFavorite(item) ? removeFromFavorites(item) : addToFavorites(item)}
                        >
                        <Icons type={isFavorite(item) ? 'fav-black' : 'fav'} active={isFavorite(item)} />
                    </TouchableOpacity>
                </View>


                <ScrollView style={{width: '100%', paddingHorizontal: 16}}>
                    {
                        item.description.map((desc, i) => (
                            <Text key={i} style={styles.description}>{desc}</Text>
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

    description: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 19,
        color: '#f7d671',
        marginBottom: 24
    },

});

export default GalleryDetails;
