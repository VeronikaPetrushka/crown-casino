import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, ScrollView, Modal, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icons from './Icons';
import AddCrown from './AddCrown';

const { height } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const Home = () => {
    const navigation = useNavigation();
    const [filterPressed, setFilterPressed] = useState('gold');
    const [crowns, setCrowns] = useState([]);
    const [filteredCrowns, setFilteredCrowns] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [dotsModalVisible, setDotsModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCrownToDelete, setSelectedCrownToDelete] = useState(null);
    const [crownToEdit, setCrownToEdit] = useState(null);

    const fetchCrowns = async () => {
        try {
            const storedCrowns = await AsyncStorage.getItem('crowns');
            const parsedCrowns = storedCrowns ? JSON.parse(storedCrowns) : [];
            setCrowns(parsedCrowns);

            setFilteredCrowns(parsedCrowns.filter(crown => crown.filterChosen === 'gold'));
        } catch (error) {
            console.error('Error retrieving crowns:', error);
        }
    };

    useEffect(() => {
        const updatedFilteredCrowns = crowns.filter(crown => crown.filterChosen === filterPressed);
        setFilteredCrowns(updatedFilteredCrowns);
    }, [filterPressed, crowns]);

    const fetchFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            setFavorites(parsedFavorites);
        } catch (error) {
            console.error('Error retrieving favorites:', error);
        }
    };

    const addToFavorites = async (crown) => {
        try {
            const updatedFavorites = [...favorites, crown];
            setFavorites(updatedFavorites);

            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            console.log('Crown added to favorites!');
        } catch (error) {
            console.error('Error adding crown to favorites:', error);
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
            fetchCrowns();
            fetchFavorites();
        }, [])
    );

    const isFavorite = (crown) => {
        return favorites.some(fav => fav.heading === crown.heading);
    }; 

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
    
                setFilteredCrowns(updatedCrowns.filter(crown => crown.filterChosen === filterPressed));
    
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

                <View style={{width: '100%', paddingTop: height * 0.07, paddingHorizontal: 16}}>
                    <View style={styles.upperContainer}>
                        <Text style={styles.title}>Your Crowns</Text>
                        <TouchableOpacity style={styles.favBtn} onPress={() => navigation.navigate('FavsScreen')}>
                            <Icons type={'fav'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.panelContainer}>
                        <TouchableOpacity 
                            style={[styles.panelBtn, filterPressed === 'gold' && {backgroundColor: '#f7d671'}]}
                            onPress={() => setFilterPressed('gold')}
                            >
                            <Text 
                                style={[styles.panelBtnText, filterPressed === 'gold' && {color: '#000', fontWeight: '600'}]}
                                >
                                    Gold
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity  
                            style={[styles.panelBtn, filterPressed === 'silver' && {backgroundColor: '#f7d671'}]}
                            onPress={() => setFilterPressed('silver')}
                            >
                            <Text 
                                style={[styles.panelBtnText, filterPressed === 'silver' && {color: '#000', fontWeight: '600'}]}
                                >
                                    Silver
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.panelBtn, {borderRightWidth: 0}, filterPressed === 'bronze' && {backgroundColor: '#f7d671'}]}
                            onPress={() => setFilterPressed('bronze')}
                            >
                            <Text 
                                style={[styles.panelBtnText, filterPressed === 'bronze' && {color: '#000', fontWeight: '600'}]}
                                >
                                    Bronze
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {filteredCrowns.length > 0 ? (
                    <ScrollView style={{width: '100%', paddingHorizontal: 16}}>
                        {filteredCrowns.map((crown, index) => (
                            <TouchableOpacity key={index} style={styles.crownItem} onPress={() => navigation.navigate('DetailsScreen', {crown: crown})}>
                                <View style={styles.crownTools}>
                                    <TouchableOpacity 
                                        style={[styles.crownToolIcon, {width: 36}]}
                                        onPress={() => handleCrownSelection(crown)}
                                        >
                                        <Icons type={'dots'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.crownToolIcon} 
                                        onPress={() => isFavorite(crown) ? removeFromFavorites(crown) : addToFavorites(crown)}
                                        >
                                        <Icons type={isFavorite(crown) ? 'fav-black' : 'fav'} active={isFavorite(crown)} />
                                    </TouchableOpacity>
                                </View>
                                {crown.image && <Image source={{ uri: crown.image }} style={styles.crownImage} />}
                                <View style={{width: '100%'}}>
                                    <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 4}}>
                                        <Text style={[styles.crownHeading, {width: 200}]} numberOfLines={1} ellipsizeMode='tail'>{crown.heading}</Text>
                                        <Text style={styles.crownDescription}>{crown.filterChosen}</Text>
                                    </View>
                                    <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                                        <Text style={[styles.crownDescription, {width: 200}]} numberOfLines={1} ellipsizeMode='tail'>{crown.description}</Text>
                                        <Text style={styles.crownDescription}>{crown.jewels.length} items</Text>
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
                        <Text style={styles.noText}>There aren’t any beaches you add yet, you can do it now</Text>
                        <TouchableOpacity style={styles.noAddBtn} onPress={() => navigation.navigate('AddCrownScreen')}>
                            <Text style={styles.noAddBtnText}>Add a crown</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            {
                filteredCrowns.length > 0 && (
                    <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddCrownScreen')}>
                        <Icons type={'plus'} />
                    </TouchableOpacity>
                )
            }

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
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 80
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

    addBtn: {
        width: 78,
        height: 78,
        padding: 23,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fdf8ea',
        borderRadius: 100,
        borderColor: '#f7d671',
        borderWidth: 1,
        position: 'absolute',
        right: 16,
        bottom: 120
    },

    panelContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 16,
    },

    panelBtn: {
        width: '33.33%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#999',
        paddingVertical: 9
    },

    panelBtnText: {
        fontWeight: '400',
        fontSize: 13,
        lineHeight: 18,
        color: '#f7d671'
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
        borderRadius: 20,
        backgroundColor: '#f7d671'
    },

    noAddBtnText: {
        fontWeight: '300',
        fontSize: 12,
        lineHeight: 14.32,
        color: '#000',
    },

    crownItem: {
        width: '100%',
        height: 224,
        marginBottom: 24
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

})

export default Home;