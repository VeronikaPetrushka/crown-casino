import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Dimensions, StyleSheet } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const Signup = ({ item , sign}) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(sign ? sign.user : '');
    const [phone, setPhone] = useState(sign ? sign.phone : '');
    const [saved, setSaved] = useState(false);

    const resetInput = (setter) => {
        setter('');
    };

    const handleSave = async () => {
        if (!user || !phone) {
            alert('Please fill out all fields to proceed.');
            return;
        }
    
    
        const newSignup = {
            user,
            phone
        };
    
        try {
            const existingSigns = await AsyncStorage.getItem('signed');
            let signs = existingSigns ? JSON.parse(existingSigns) : [];
    
            if (sign) {
                const updatedSigns = signs.map(i => 
                    i.user === sign.user ? { ...i, ...newSignup } : i
                );
                signs = updatedSigns;
            } else {
                signs.push(newSignup);
            }
    
            await AsyncStorage.setItem('signed', JSON.stringify(signs));
    
            console.log(signs);
            setSaved(true);
        } catch (error) {
            console.error('Error saving sign up:', error);
            alert('Failed to save the sign up. Please try again.');
        }
    };
    console.log(item)
    return (
        <View style={styles.container}>

            {
                saved ? (
                    <View style={{flex: 1, padding: 16, paddingTop: height * 0.07, paddingBottom: 85, alignItems: 'flex-start'}}>
                        <TouchableOpacity style={{width: 44, height: 44, marginLeft: -38}} onPress={() => navigation.goBack('')}>
                            <Icons type={'back'} />
                        </TouchableOpacity>
                        <Text style={[styles.title, {fontSize: 44, marginTop: 22, lineHeight: 53, marginBottom: 70}]}>Signed up the event</Text>
                        <Image source={require('../assets/decor/done.png')} style={{ width: 120, height: 120, alignSelf: 'center'}} />
                        {/* <View style={{width: '100%', alignSelf: 'center'}}>
                            <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image}  style={styles.itemImg} />
                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                                <Text style={styles.eventName}>{item.name || item.heading}</Text>
                                <Text style={styles.eventTime}>{item.time}</Text>
                            </View>
                        </View> */}
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
                                <Icons type={'back'} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Sign up the event</Text>
                        </View>

                            <Text style={styles.label}>Your name</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    placeholderTextColor="#999"
                                    value={user}
                                    onChangeText={setUser}
                                />
                                {user ? (
                                    <TouchableOpacity style={styles.cross} onPress={() => resetInput(setUser)}>
                                        <Icons type={'cross'} />
                                    </TouchableOpacity>
                                ) : null}
                            </View>

                            <Text style={styles.label}>Phone number</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="111 111 111"
                                    placeholderTextColor="#999"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="numeric"
                                />
                                {phone ? (
                                    <TouchableOpacity style={styles.cross} onPress={() => resetInput(setPhone)}>
                                        <Icons type={'cross'} />
                                    </TouchableOpacity>
                                ) : null}
                            </View>

                        <View style={styles.saveBtnContainer}>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveBtnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }

        </View>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fdf8ea',
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
        color: '#000'
    },

    label: {
        fontSize: 20, 
        fontWeight: '700',
        alignSelf: 'flex-start', 
        marginBottom: 16, 
        lineHeight: 23.87, 
        color: '#000'
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
        color: '#000',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
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

    saveBtnContainer: {
        width: '110%', 
        padding: 16, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center'
    },

    saveBtn: {
        width: '100%',
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16.5
    },

    saveBtnText: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 19,
        color: '#fff',
    },

    error: {
        color: '#ff3b30',
        marginTop: -15,
        marginBottom: 24,
        fontSize: 11,
        fontWeight: '300'
    },

    time: {
        fontWeight: '300',
        fontSize: 12,
        lineHeight: 14.32,
        color: '#000',
        opacity: 0.5
    },

    itemImg: {
        width: '100%',
        height: 177,
        marginBottom: 12,
        resizeMode: 'cover',
    },

})

export default Signup;