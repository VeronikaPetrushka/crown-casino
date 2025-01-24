import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, ScrollView, Modal, ImageBackground } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import events from '../constants/events';
import Icons from './Icons';

const { height, width } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const Events = () => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);
    const [addedEvents, setAddedEvents] = useState([]); 
    const [calendar, setCalendar] = useState(false);
    const [date, setDate] = useState(null);
    const [filterPressed, setFilterPressed] = useState('general');
    const [dotsModalVisible, setDotsModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEventToDelete, setSelectedEventToDelete] = useState(null);
    const [eventToEdit, setEventToEdit] = useState(null);

    const fetchAddedEvents = async () => {
        try {
            const storedEvents = await AsyncStorage.getItem('events');
            const parsedEvents = storedEvents ? JSON.parse(storedEvents) : [];
            setAddedEvents(parsedEvents);
        } catch (error) {
            console.error('Error retrieving added events:', error);
        }
    };

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
            console.log('Item added to favorites!');
        } catch (error) {
            console.error('Error adding item to favorites:', error);
        }
    };

    const removeFromFavorites = async (item) => {
        try {
            const updatedFavorites = favorites.filter(fav => fav.name !== item.name);
            setFavorites(updatedFavorites);

            await AsyncStorage.setItem('favoriteEvents', JSON.stringify(updatedFavorites));
            console.log('Item removed from favorites!');
        } catch (error) {
            console.error('Error removing item from favorites:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAddedEvents();
            fetchFavorites();
        }, [])
    );

    const isFavorite = (item) => {
        return favorites.some(fav => fav.name === item.name);
    };

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('.');
        const date = new Date(`${year}-${month}-${day}`);
        return date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }; 
    
    const handleDeleteDots = () => {
        setDotsModalVisible(false);
        setModalVisible(true);
    };

    const handleEventSelection = (item) => {
        setEventToEdit(item);
        setSelectedEventToDelete(item);
        setDotsModalVisible(true)
    }
    
    const deleteEvent = async () => {
        if (selectedEventToDelete) {
            try {
                const updatedAddedEvents = addedEvents.filter(event => event.heading !== selectedEventToDelete.heading);
                setAddedEvents(updatedAddedEvents);
        
                const updatedFavorites = favorites.filter(fav => fav.heading !== selectedEventToDelete.heading);
                setFavorites(updatedFavorites);
    
                await AsyncStorage.setItem('events', JSON.stringify(updatedAddedEvents));
                await AsyncStorage.setItem('favoriteEvents', JSON.stringify(updatedFavorites));
    
                console.log('Event and its favorite entry deleted successfully!');
                setModalVisible(false);
            } catch (error) {
                console.error('Error deleting event or favorite:', error);
            }
        }
    };

    const handleEdit = () => {
        setDotsModalVisible(false);
        navigation.navigate('AddEventScreen', {event: eventToEdit}) 
    };

    const handleCalendar = () => {
        if(calendar) {
            setCalendar(false);
        } else {
            setCalendar(true);
        }
    };

    const handleDayPress = (day) => {
        const selectedDate = new Date(day.dateString);
        setDate(selectedDate);
        setCalendar(false);
    };
    
    const cancelFilter = () => {
        setDate(null);
        setCalendar(false);
    };     

    const filteredEvents = date
    ? events.filter(item => {
        const eventDate = new Date(item.date);
        return eventDate.toDateString() === date.toDateString();
    })
    : events;

    const filteredAddedEvents = date
        ? addedEvents.filter(item => {
            const addedEventDate = new Date(item.date);
            return addedEventDate.toDateString() === date.toDateString();
        })
        : addedEvents;

    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>

                <View style={styles.upperContainer}>
                    <View style={{width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        marginBottom: 16
                    }}
                        >
                        <Text style={styles.title}>Crowns events</Text>
                        <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.calendarBtn} onPress={handleCalendar}>
                                <Icons type={date != null ? 'calendar2' : 'calendar'} active />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.favBtn} onPress={() => navigation.navigate('FavsEventsScreen')}>
                                <Icons type={'fav'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.panelContainer}>
                        <TouchableOpacity 
                            style={[styles.panelBtn, filterPressed === 'general' && {backgroundColor: '#f7d671'}]}
                            onPress={() => setFilterPressed('general')}
                            >
                            <Text 
                                style={[styles.panelBtnText, filterPressed === 'general' && {color: '#000', fontWeight: '600'}]}
                                >
                                    General
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity  
                            style={[styles.panelBtn, {borderRightWidth: 0}, filterPressed === 'added' && {backgroundColor: '#f7d671'}]}
                            onPress={() => setFilterPressed('added')}
                            >
                            <Text 
                                style={[styles.panelBtnText, filterPressed === 'added' && {color: '#000', fontWeight: '600'}]}
                                >
                                    Added
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

                {
                    calendar ? (
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <Calendar
                                style={{ width: width * 0.88, borderWidth: 1, borderColor: '#f7d671', backgroundColor: '#f7d671', overflow: 'hidden', padding: 5}}
                                                onDayPress={handleDayPress}
                                                markedDates={
                                                    date
                                                        ? { [date.toISOString().split('T')[0]]: { selected: true, selectedColor: '#f7d671' } }
                                                        : {}
                                                }
                                theme={{
                                    selectedDayBackgroundColor: '#f7d671',
                                    textSectionTitleColor: '#301901', 
                                    todayTextColor: '#f7d671',
                                    monthTextColor: '#000',
                                    arrowColor: '#000',
                                    textDayFontWeight: '500',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: '500',
                                }}
                            />
                            {
                                date && (
                                    <View style={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={cancelFilter} style={styles.noAddBtn}>
                                            <Text style={styles.noAddBtnText}>Cancel Filter</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
                    ) : (
                        <View style={{width: '100%'}}>
                            <ScrollView style={{width: '100%', paddingHorizontal: 16}}>

                                {
                                    filterPressed === 'general' ? (
                                        <View style={{width: '100%'}}>
                                            {
                                                filteredEvents.map((item, index) => (
                                                    <TouchableOpacity key={index} style={{width: '100%', marginBottom: 24}} onPress={() => navigation.navigate('EventsDetailsScreen', {item: item})}>
                                                        <Text style={styles.date}>{item.date}</Text>
                                                        <Image source={item.image} style={styles.image} />

                                                        <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                                                            <Text style={{color: '#f7d671'}}>{item.name}</Text>
                                                            <Text style={styles.time}>{item.time}</Text>
                                                        </View>
                                                        <TouchableOpacity 
                                                            style={styles.favIcon} 
                                                            onPress={() => isFavorite(item) ? removeFromFavorites(item) : addToFavorites(item)}
                                                            >
                                                            <Icons type={isFavorite(item) ? 'fav-black' : 'fav'} active={isFavorite(item)} />
                                                        </TouchableOpacity>
                                                    </TouchableOpacity>
                                                ))
                                            }
                                            {
                                                filteredEvents.length === 0 && (
                                                    <View style={styles.noContainer}>
                                                        <View style={styles.noImage}>
                                                            <Icons type={'1'} active />
                                                        </View>
                                                        <Text style={styles.noText}>There aren’t any events on selected date</Text>
                                                    </View>
                                                )
                                            }
                                        </View>        
                                    ) : (
                                        <View style={{width: '100%'}}>
                                            {
                                                filteredAddedEvents.length > 0 ? (
                                                    <View style={{width: '100%'}}>
                                                        {
                                                            filteredAddedEvents.map((item, index) => (
                                                                <TouchableOpacity key={index} style={{width: '100%', marginBottom: 24}} onPress={() => navigation.navigate('EventsDetailsScreen', {item: item})}>
                                                                    <Text style={styles.date}>{formatDate(item.date)}</Text>
                                                                    <Image source={{uri: item.image}} style={styles.image} />
                                        
                                                                    <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                                                                        <Text style={{color: '#f7d671'}}>{item.heading}</Text>
                                                                        <Text style={styles.time}>{item.time}</Text>
                                                                    </View>
                                                                    <View style={styles.itemTools}>
                                                                        <TouchableOpacity 
                                                                            style={[styles.itemToolIcon, {width: 36}]}
                                                                            onPress={() => handleEventSelection(item)}
                                                                            >
                                                                            <Icons type={'dots'} />
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity 
                                                                            style={styles.itemToolIcon} 
                                                                            onPress={() => isFavorite(item) ? removeFromFavorites(item) : addToFavorites(item)}
                                                                            >
                                                                            <Icons type={isFavorite(item) ? 'fav-black' : 'fav'} active={isFavorite(item)} />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            ))
                                                        }
                                                    </View>
                                                ) : (
                                                    <View style={styles.noContainer}>
                                                        <View style={styles.noImage}>
                                                            <Icons type={'1'} active />
                                                        </View>
                                                        {
                                                            filteredEvents.length === 0 ? (
                                                                    <Text style={styles.noText}>There aren’t any events on selected date</Text>
                                                            ) : (
                                                                <Text style={styles.noText}>There aren’t any events you add yet, you can do it now</Text>
                                                            )
                                                        }
                                                        <TouchableOpacity style={styles.noAddBtn} onPress={() => navigation.navigate('AddEventScreen')}>
                                                            <Text style={styles.noAddBtnText}>Add an event</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }
                                        </View>

                                    )
                                }

                                <View style={{height: 200}} />
                            </ScrollView>

                        </View>
                    )
                }

                {
                    filteredAddedEvents.length > 0 && filterPressed === 'added' && (
                        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddEventScreen')}>
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
                                <Text style={styles.modalTitle}>Delete the event ?</Text>
                                <Text style={styles.modalText}>{`Are you sure you want to delete ${selectedEventToDelete?.heading}?`}</Text>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={deleteEvent}
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
        paddingBottom: 85
    },

    upperContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
        paddingTop: height * 0.07,
        padding: 16,
    },

    title: {
        fontWeight: '900',
        fontSize: 28,
        lineHeight: 33.41,
        color: '#f7d671'
    },

    calendarBtn: {
        width: 48,
        height: 48,
        marginRight: 16,
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

    favIcon: {
        width: 28,
        height: 24,
        position: 'absolute',
        top: 46,
        right: 16,
    },

    itemToolIcon: {
        width: 28,
        height: 24,
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

    panelContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

    panelBtn: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#999',
        paddingVertical: 9,
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
        marginTop: '20%',
        alignSelf: 'center'
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

    itemTools: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        top: 30,
        left: 0,
        zIndex: 10,
        padding: 16
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

export default Events;
