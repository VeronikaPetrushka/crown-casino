import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, ScrollView, Modal, ImageBackground } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const Favs = () => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);
    const [crowns, setCrowns] = useState([]);
    const [dotsModalVisible, setDotsModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCrownToDelete, setSelectedCrownToDelete] = useState(null);
    const [crownToEdit, setCrownToEdit] = useState(null);

    const fetchFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            setFavorites(parsedFavorites);
        } catch (error) {
            console.error('Error retrieving favorites:', error);
        }
    };

    const removeFromFavorites = async (crown) => {
        try {
            const updatedFavorites = favorites.filter(fav => fav.heading !== crown.heading);
            setFavorites(updatedFavorites);

            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
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

    const handleDeleteDots = () => {
        setDotsModalVisible(false);
        setModalVisible(true);
    };

    const handleCrownSelection = (crown) => {
        setCrownToEdit(crown);
        setSelectedCrownToDelete(crown);
        setDotsModalVisible(true)
    }

    const deleteCrown = async () => {
        if (selectedCrownToDelete) {
            try {
                const updatedCrowns = crowns.filter(crown => crown.heading !== selectedCrownToDelete.heading);
                setCrowns(updatedCrowns);
        
                const updatedFavorites = favorites.filter(fav => fav.heading !== selectedCrownToDelete.heading);
                setFavorites(updatedFavorites);
    
                await AsyncStorage.setItem('crowns', JSON.stringify(updatedCrowns));
                await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
                console.log('Crown and its favorite entry deleted successfully!');
                setModalVisible(false);
            } catch (error) {
                console.error('Error deleting crown or favorite:', error);
            }
        }
    };

    const handleEdit = () => {
        setDotsModalVisible(false);
        navigation.navigate('AddCrownScreen', {crown: crownToEdit}) 
    }

    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                        <Icons type={'back'} active />
                    </TouchableOpacity>
                    <Text style={styles.title}>Your Favorites</Text>
                </View>

                {favorites?.length > 0 ? (
                    <ScrollView style={{ width: '100%'}}>
                        {favorites.map((crown, index) => (
                            <TouchableOpacity key={index} style={styles.crownItem} onPress={() => navigation.navigate('DetailsScreen', {crown: crown})}>
                                <View style={styles.crownTools}>
                                    <TouchableOpacity 
                                        style={[styles.crownToolIcon, { width: 36 }]}
                                        onPress={() => handleCrownSelection(crown)}
                                        >
                                        <Icons type={'dots'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.crownToolIcon} onPress={() => removeFromFavorites(crown)}>
                                        <Icons type={'fav-black'} active />
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
                                        <Text style={styles.crownDescription}>{crown.jewels?.length} items</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <View style={styles.noContainer}>
                        <View style={styles.noImage}>
                            <Icons type={'1'} active />
                        </View>
                        <Text style={styles.noText}>You don't have any favorite crowns yet.</Text>
                        <TouchableOpacity style={styles.noAddBtn} onPress={() => navigation.navigate('HomeScreen')}>
                            <Text style={styles.noAddBtnText}>Go to Home</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={dotsModalVisible}
                    onRequestClose={() => setDotsModalVisible(false)}
                >
                    <View style={[styles.modalContainer, {justifyContent: 'flex-end'}]}>
                        <View style={styles.modalContentDots}>
                            <View style={styles.modalBtnsContainer}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handleEdit}
                                >
                                    <Text 
                                        style={[styles.modalButtonText, {borderTopWidth: 0, fontWeight: '400', color: '#000'}]}>
                                            Edit
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handleDeleteDots}
                                >
                                    <Text style={[styles.modalButtonText, {fontWeight: '400'}]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.dotsCancelBtn}
                                onPress={() => setDotsModalVisible(false)}
                            >
                                <Text style={styles.dotsCancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Delete the crown ?</Text>
                            <Text style={styles.modalText}>{`Are you sure you want to delete ${selectedCrownToDelete?.heading}?`}</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={deleteCrown}
                            >
                                <Text style={styles.modalButtonText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{width: '100%', paddingVertical: 11, alignItems: 'center', justifyContent: 'center'}}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.modalButtonText, {fontWeight: '400', color: '#000'}]}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

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

    title: {
        fontWeight: '700',
        fontSize: 28,
        lineHeight: 33.41,
        color: '#f7d671'
    },

    crownItem: {
        width: '100%',
        height: 224,
        marginBottom: 24,
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
        color: '#f7d671',
    },

    crownDescription: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 14.32,
        color: '#f7d671',
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

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },

    modalContent: {
        width: '70%',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingTop: 16,
        alignItems: 'center',
    },

    modalContentDots: {
        width: '95%',
        alignItems: 'center',
    },

    modalBtnsContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 8
    },

    dotsCancelBtn: {
        width: '100%',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
    },

    dotsCancelBtnText: {
        fontWeight: '600',
        fontSize: 17,
        lineHeight: 22,
        color: '#000',
    },

    modalButton: {
        width: '100%',
        paddingVertical: 11,
        borderTopWidth: 0.33,
        borderBottomWidth: 0.33,
        borderBottomColor: '#999',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalButtonText: {
        fontWeight: '600',
        fontSize: 17,
        lineHeight: 22,
        color: '#ff0e0a',
    },

    modalTitle: {
        fontWeight: '600',
        fontSize: 17,
        lineHeight: 22,
        color: '#000',
        marginBottom: 5
    },

    modalText: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 19,
        color: '#000',
        marginBottom: 16,
        textAlign: 'center'
    },

});

export default Favs;
