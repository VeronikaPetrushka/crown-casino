import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const Favs = () => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            setFavorites(parsedFavorites);
        } catch (error) {
            console.error('Error retrieving favorites:', error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

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
                    {favorites.map((crown, index) => (
                        <View key={index} style={styles.crownItem}>
                            <View style={styles.crownTools}>
                                <TouchableOpacity style={[styles.crownToolIcon, { width: 36 }]}>
                                    <Icons type={'dots'} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.crownToolIcon}>
                                    <Icons type={'fav'} favorite={true} />
                                </TouchableOpacity>
                            </View>
                            {crown.image && <Image source={{ uri: crown.image }} style={styles.crownImage} />}
                            <View style={{ width: '100%' }}>
                                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 4 }}>
                                    <Text style={[styles.crownHeading, { width: 200 }]} numberOfLines={1} ellipsizeMode='tail'>{crown.heading}</Text>
                                    <Text style={styles.crownDescription}>{crown.filterChosen}</Text>
                                </View>
                                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <Text style={[styles.crownDescription, { width: 200 }]} numberOfLines={1} ellipsizeMode='tail'>{crown.description}</Text>
                                    <Text style={styles.crownDescription}>{crown.jewels.length} items</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.noContainer}>
                    <Image source={require('../assets/decor/crown.png')} style={styles.noImage} />
                    <Text style={styles.noText}>You don't have any favorite crowns yet.</Text>
                    <TouchableOpacity style={styles.noAddBtn} onPress={() => navigation.navigate('Home')}>
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

    title: {
        fontWeight: '700',
        fontSize: 28,
        lineHeight: 33.41,
        color: '#000'
    },

    crownItem: {
        width: '100%',
        height: 224
    },

    crownImage: {
        width: '100%',
        height: 177,
        marginBottom: 10,
        resizeMode: 'cover'
    },

    crownHeading: {
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 21.48,
        color: '#000',
    },

    crownDescription: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 14.32,
        color: '#000',
        opacity: 0.4
    },

    crownTools: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        padding: 16
    },

    crownToolIcon: {
        width: 28,
        height: 24
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

export default Favs;
