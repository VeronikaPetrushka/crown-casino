import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Dimensions, StyleSheet, ScrollView, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const AddEvent = ({ event }) => {
    const navigation = useNavigation();
    const [heading, setHeading] = useState(event ? event.heading : '');
    const [description, setDescription] = useState(event ? event.description : '');
    const [date, setDate] = useState(event ? event.date : '');
    const [time, setTime] = useState(event ? event.time : '');
    const [image, setImage] = useState(event ? event.image : null);
    const [saved, setSaved] = useState(false);
    const [dateError, setDateError] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);

    const resetInput = (setter) => {
        setter('');
    };

    const handleDateChange = (text) => {
        let formattedDate = text.replace(/\D/g, '');
        
        if (formattedDate.length > 8) {
            formattedDate = formattedDate.slice(0, 8);
        }
    
        if (formattedDate.length > 2) formattedDate = formattedDate.slice(0, 2) + '.' + formattedDate.slice(2);
        if (formattedDate.length > 5) formattedDate = formattedDate.slice(0, 5) + '.' + formattedDate.slice(5);
    
        setDate(formattedDate);
    
        if (formattedDate.length === 10) {
            const [day, month, year] = formattedDate.split('.').map(Number);
            const enteredDate = new Date(year, month - 1, day);
            const today = new Date();
    
            if (
                month < 1 || 
                month > 12 || 
                day < 1 || 
                day > 31 || 
                isNaN(enteredDate.getTime()) ||
                enteredDate <= today
            ) {
                setDateError('Invalid or past date');
            } else {
                setDateError('');
            }
        } else {
            setDateError('');
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);

        if (selectedTime) {
            const hours = selectedTime.getHours();
            const minutes = selectedTime.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            setTime(formattedTime);
        }
    };
        
    const handleImagePicker = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (!response.didCancel && !response.error && response.assets) {
                setImage(response.assets[0].uri);
            }
        });
    };
    
    const resetImage = () => {
        setImage(null);
    };

    const handleSave = async () => {
        if (!heading || !description || !image || !date || !time || dateError) {
            alert('Please fill out all fields to proceed.');
            return;
        }
    
    
        const newEvent = {
            heading,
            description,
            date,
            time,
            image,
        };
    
        try {
            const existingEvents = await AsyncStorage.getItem('events');
            let events = existingEvents ? JSON.parse(existingEvents) : [];
    
            if (event) {
                const updatedEvents = events.map(e => 
                    e.heading === event.heading ? { ...e, ...newEvent } : e
                );
                events = updatedEvents;
            } else {
                events.push(newEvent);
            }
    
            await AsyncStorage.setItem('events', JSON.stringify(events));
    
            console.log(events);
            setSaved(true);
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save the event. Please try again.');
        }
    };
    
    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>

                {
                    saved ? (
                        <View style={{flex: 1, padding: 16, paddingTop: height * 0.07, paddingBottom: 85, alignItems: 'flex-start'}}>
                            <TouchableOpacity style={{width: 44, height: 44, marginLeft: -38}} onPress={() => navigation.goBack('')}>
                                <Icons type={'back'} active />
                            </TouchableOpacity>
                            <Text style={[styles.title, {fontSize: 44, marginTop: 22, lineHeight: 53, marginBottom: 70}]}>Event is successfully added</Text>
                            <View style={{ width: 120, height: 120, alignSelf: 'center', backgroundColor: 'rgba(247, 214, 113, 0.4)'}}>
                                <Image source={require('../assets/decor/done.png')} style={{width: '100%', height: '100%', resizeMode: 'contain'}} />
                            </View>
                            <View style={styles.saveBtnContainer}>
                                <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.navigate('EventsScreen')}>
                                    <Text style={styles.saveBtnText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={{flex: 1, padding: 16, paddingTop: height * 0.07, paddingBottom: 85}}>
                            <View style={styles.upperContainer}>
                                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                                    <Icons type={'back'} active />
                                </TouchableOpacity>
                                <Text style={styles.title}>Add an event</Text>
                            </View>

                            <ScrollView style={{width: '100%'}}>
                                <Text style={styles.label}>Heading</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Event name"
                                        placeholderTextColor="#999"
                                        value={heading}
                                        onChangeText={setHeading}
                                    />
                                    {heading ? (
                                        <TouchableOpacity style={styles.cross} onPress={() => resetInput(setHeading)}>
                                            <Icons type={'cross'} />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>

                                <Text style={styles.label}>Description</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Event description"
                                        placeholderTextColor="#999"
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                    />
                                    {description ? (
                                        <TouchableOpacity style={styles.cross} onPress={() => resetInput(setDescription)}>
                                            <Icons type={'cross'} />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>

                                <Text style={styles.label}>Date</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, {paddingLeft: 50}]}
                                        placeholder="DD.MM.YY"
                                        placeholderTextColor="#999"
                                        value={date}
                                        onChangeText={handleDateChange}
                                        keyboardType="numeric"
                                        maxLength={10}
                                    />
                                    <View style={styles.dateIcon}>
                                        <Icons type={'date'} active />
                                    </View>
                                    {date ? (
                                        <TouchableOpacity style={styles.cross} onPress={() => resetInput(setDate)}>
                                            <Icons type={'cross'} />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                                {dateError ? <Text style={styles.error}>{dateError}</Text> : null}

                                <Text style={styles.label}>Time</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, {paddingLeft: 50}]}
                                        placeholder="00:00"
                                        placeholderTextColor="#999"
                                        value={time}
                                        editable={false}
                                    />
                                    <TouchableOpacity style={styles.dateIcon} onPress={() => setShowTimePicker(true)}>
                                        <Icons type={'time'} active />
                                    </TouchableOpacity>
                                    {time ? (
                                        <TouchableOpacity style={styles.cross} onPress={() => resetInput(setTime)}>
                                            <Icons type={'cross'} />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                                {showTimePicker && (
                                        <DateTimePicker
                                            value={new Date()}
                                            mode="time"
                                            is24Hour={false}
                                            themeVariant="dark"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={handleTimeChange}
                                        />
                                    )}

                                <Text style={styles.label}>Photo</Text>
                                <View style={styles.imageContainer}>
                                    {image ? (
                                        <>
                                            <Image source={{ uri: image }} style={styles.uploadedImage} />
                                            <TouchableOpacity style={styles.crossImg} onPress={resetImage}>
                                                <Icons type={'cross'} />
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <TouchableOpacity style={styles.add} onPress={handleImagePicker}>
                                            <Icons type={'plus'} active />
                                        </TouchableOpacity>
                                    )}
                                </View>

                            </ScrollView>

                            <View style={styles.saveBtnContainer}>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                    <Text style={styles.saveBtnText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }

            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    upperContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 25,
    },

    back: {
        width: 44,
        height: 44,
        marginRight: 16
    },

    title: {
        fontWeight: '700',
        fontSize: 28,
        lineHeight: 33.41,
        color: '#f7d671'
    },

    label: {
        fontSize: 20, 
        fontWeight: '700',
        alignSelf: 'flex-start', 
        marginBottom: 16, 
        lineHeight: 23.87, 
        color: '#f7d671'
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
    },

    input: {
        width: '100%',
        fontSize: 16,
        fontWeight: '400',
        color: '#f7d671',
        borderWidth: 1,
        borderColor: '#f7d671',
        paddingHorizontal: 20,
        paddingVertical: 16.5,
    },

    cross: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 15,
        right: 20,
        zIndex: 10
    },

    imageContainer: {
        width: 100,
        height: 150,
        borderWidth: 1,
        borderColor: "#999",
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start'
    },

    add: {
        width: 36,
        height: 36
    },

    crossImg: {
        width: 27,
        height: 27,
        position: 'absolute',
        top: -12,
        right: -12,
        zIndex: 10,
        padding: 3,
        backgroundColor: '#ececec',
        borderRadius: 30
    },

    uploadedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    dateIcon: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 15,
        left: 20,
        zIndex: 10
    },

    saveBtnContainer: {
        width: '110%', 
        padding: 16, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#120900',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center'
    },

    saveBtn: {
        width: '100%',
        backgroundColor: '#301901',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16.5
    },

    saveBtnText: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 19,
        color: '#f7d671',
    },

    error: {
        color: '#ff3b30',
        marginTop: -15,
        marginBottom: 24,
        fontSize: 11,
        fontWeight: '300'
    }

})

export default AddEvent;