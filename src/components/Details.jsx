// jewels refresh fix
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, ScrollView , Modal, ImageBackground } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const Details = ({ crown }) => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);
    const [crowns, setCrowns] = useState([]);
    const [dotsModalVisible, setDotsModalVisible] = useState(false);
    const [crownModalVisible, setCrownModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCrownToDelete, setSelectedCrownToDelete] = useState(null);
    const [crownToEdit, setCrownToEdit] = useState(null);
    const [selectedJewel, setSelectedJewel] = useState(null);
    const [jewelsMore, setJewelsMore] = useState(false);
    const [crownState, setCrownState] = useState(crown);
    const [refreshKey, setRefreshKey] = useState(0);

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

    useEffect(() => {
        fetchFavorites();
    }, []);

    const isFavorite = (crown) => {
        return favorites.some(fav => fav.heading === crown.heading);
    };

    const deleteJewel = async (jewel) => {
        try {
            const updatedJewels = crownState.jewels.filter(item => item.heading !== jewel.heading);

            const storedCrowns = await AsyncStorage.getItem('crowns');
            const parsedCrowns = storedCrowns ? JSON.parse(storedCrowns) : [];
            const updatedCrowns = parsedCrowns.map(storedCrown =>
                storedCrown.heading === crownState.heading ? { ...crownState, jewels: updatedJewels } : storedCrown
            );

            await AsyncStorage.setItem('crowns', JSON.stringify(updatedCrowns));

            setCrownState(prevState => ({
                ...prevState,
                jewels: updatedJewels,
            }));
            setRefreshKey(prevKey => prevKey + 1);

            setSelectedJewel(null);
            setModalVisible(false);

            console.log('Jewel deleted successfully!');
        } catch (error) {
            console.error('Error deleting jewel:', error);
        }
    };

    const handleDeleteDots = () => {
        setDotsModalVisible(false);
        setCrownModalVisible(true);
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
                setCrownModalVisible(false);

                navigation.goBack('');

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
            <View style={styles.container} key={refreshKey}>

                <View style={styles.upperContainer}>
                    <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                            <Icons type={'back'} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.crownToolIcon, {width: 36}]}
                        onPress={() => handleCrownSelection(crown)}
                        >
                            <Icons type={'dots'} />
                    </TouchableOpacity>
                </View>

                <Image source={{ uri: crown.image}} style={styles.image} />

                <View style={styles.headingContainer}>
                    <Text style={styles.heading}>{crown.heading}</Text>
                    <TouchableOpacity 
                        style={styles.crownToolIcon} 
                        onPress={() => isFavorite(crown) ? removeFromFavorites(crown) : addToFavorites(crown)}
                        >
                        <Icons type={isFavorite(crown) ? 'fav-black' : 'fav'} />
                    </TouchableOpacity>
                </View>


                <ScrollView style={{width: '100%', paddingHorizontal: 16}}>

                    {
                        jewelsMore ? (
                            <View style={{width: '100%'}}>
                                <TouchableOpacity 
                                        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 24}} 
                                        onPress={() => setJewelsMore(false)}
                                    >
                                    <View style={{width: 10, height: 20, marginRight: 5, transform: [{ rotate: '180deg' }]}}>
                                        <Icons type={'arrow'} active />
                                    </View>
                                    <Text>{crown.jewels.length} items</Text>
                                </TouchableOpacity>

                                {
                                    crown.jewels.length > 0 ? (
                                        <>
                                            {
                                                crown.jewels.map((jewel, index) => (
                                                    <View key={index} style={[styles.jewelContainer, {flexDirection: 'column', alignItems: 'flex-start'}]}>
                                                        <Text style={styles.jewelHeading}>{jewel.heading}</Text>
                                                        <Text style={styles.description}>{jewel.description}</Text>
                                                    </View>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <Text style={[styles.description, {alignSelf: 'center', textAlign: 'center'}]}>You haven't added any jewels yet...</Text>
                                    )
                                }
                            </View>
                            ) : (
                                <View style={{width: '100%'}}>

                                    <TouchableOpacity 
                                        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 24}} 
                                        onPress={() => setJewelsMore(true)}
                                    >
                                        <Text style={styles.itemsText}>{crown.jewels.length} items</Text>
                                        <View style={{width: 10, height: 20, marginLeft: 5}}>
                                            <Icons type={'arrow'} active />
                                        </View>
                                    </TouchableOpacity>

                                    <Text style={styles.description}>{crown.description}</Text>

                                    {crown.jewels.length > 0 && (
                                        <View style={{width: '100%'}}>
                                            <Text style={styles.jewelsTitle}>Jewels and special items</Text>
                                            {
                                                crown.jewels.map((jewel, index) => (
                                                    <View key={index} style={styles.jewelContainer}>
                                                        <View>
                                                            <Text style={styles.jewelHeading}>{jewel.heading}</Text>
                                                            <Text style={styles.jewelDesc} numberOfLines={1} ellipsizeMode='tail'>{jewel.description}</Text>
                                                        </View>
                                                        <TouchableOpacity 
                                                            style={styles.deleteBtn}
                                                            onPress={() => {
                                                            setSelectedJewel(jewel);
                                                            setModalVisible(true);
                                                        }}>
                                                            <Text style={styles.deleteBtnText}>Delete</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                        )
                                    }
                            </View>
                        )
                    }


                </ScrollView>

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
                        visible={crownModalVisible}
                        onRequestClose={() => setCrownModalVisible(false)}
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
                                    onPress={() => setCrownModalVisible(false)}
                                >
                                    <Text style={[styles.modalButtonText, {fontWeight: '400', color: '#000'}]}>Close</Text>
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
                                <Text style={styles.modalTitle}>Delete the jewel ?</Text>
                                <Text style={styles.modalText}>{`Are you sure you want to delete ${selectedJewel?.heading}?`}</Text>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => deleteJewel(selectedJewel)}
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
    },

    upperContainer: {
        width: '100%',
        paddingTop: height * 0.07,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        zIndex: 10
    },

    back: {
        width: 28,
        height: 24,
        backgroundColor: '#f7d671',
    },

    image: {
        width: '100%',
        height: 323,
        marginBottom: 12,
        resizeMode: 'cover'
    },

    heading: {
        fontWeight: '700',
        fontSize: 34,
        lineHeight: 41,
        color: '#f7d671',
    },

    crownToolIcon: {
        width: 28,
        height: 24
    },

    headingContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16
    },

    itemsText: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 19,
        color: '#f7d671',
    },

    description: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 19,
        color: '#f7d671',
        marginBottom: 32
    },

    jewelsTitle: {
        fontWeight: '700',
        fontSize: 18,
        lineHeight: 21.5,
        color: '#f7d671',
        marginBottom: 12
    },

    jewelContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },

    jewelHeading: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 19,
        color: '#f7d671',
        marginBottom: 6,
        width: 200
    },

    jewelDesc: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 14.32,
        color: '#999',
        width: 200,
    },

    deleteBtn: {
        width: 87,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7d671',
        borderRadius: 20
    },

    deleteBtnText: {
        fontWeight: '400',
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
        borderRadius: 8,
        paddingTop: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    modalButton: {
        width: '100%',
        paddingVertical: 11,
        borderTopWidth: 0.33,
        borderBottomWidth: 0.33,
        borderBottomColor: '#808080',
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

export default Details;
