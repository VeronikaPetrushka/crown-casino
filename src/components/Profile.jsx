import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Dimensions, StyleSheet, Linking, ImageBackground } from "react-native"
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const Profile = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [saved, setSaved] = useState(false);

    const loadProfile = async () => {
        try {
            const savedProfile = await AsyncStorage.getItem('profile');
            if (savedProfile) {
                const profileData = JSON.parse(savedProfile);
                setName(profileData.name || '');
                setImage(profileData.image || null);
                setSaved(profileData.saved || null)
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    const resetInput = (setter) => {
        setter('');
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
    
        const profileData = {
            name,
            image,
            saved: true,
        };
    
        try {
            await AsyncStorage.setItem('profile', JSON.stringify(profileData));
            alert('Profile saved successfully!');
            console.log('Saved Profile:', profileData);

            await loadProfile();

        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save your profile. Please try again.');
        }
    };    

    const handlePrivacyPolicy = () => {
        const url = 'https://www.termsfeed.com/live/c3642e4a-b520-45e9-b604-7eddae267de7';
        Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
    };    
    
    return (
        <ImageBackground source={require('../assets/back.png')} style={{flex: 1}}>
            <View style={styles.container}>

                <View style={[styles.upperContainer, !saved && {justifyContent: 'center'}]}>
                    <Text style={styles.title}>Profile</Text>
                    {
                        saved && (
                            <TouchableOpacity onPress={() => setSaved(false)}>
                                <Text style={{fontSize: 18, color: '#f7d671'}}>Edit</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>


                <View style={{width: '100%', paddingHorizontal: 16, marginBottom: 24}}>

                    {
                        saved ? (
                            <View style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', width: '100%'}}>
                                <View style={[styles.imageContainer, {marginRight: 20}]}>
                                    <Image source={{ uri: image }} style={styles.uploadedImage} />
                                </View>
                                <Text style={[styles.title, {fontSize: 24, fontWeight: '700'}]}>{name || 'User'}</Text>
                            </View>

                        ) : (
                            <View style={{width: '100%', alignItems: 'center'}}>
                                <View style={styles.imageContainer}>
                                        {image ? (
                                            <>
                                                <Image source={{ uri: image }} style={[styles.uploadedImage, {alignSelf: 'center'}]} />
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


                                    <Text style={styles.label}>Your name</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Name"
                                            placeholderTextColor="#999"
                                            value={name}
                                            onChangeText={setName}
                                        />
                                        {name ? (
                                            <TouchableOpacity style={styles.cross} onPress={() => resetInput(setName)}>
                                                <Icons type={'cross'} />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                    

                                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                    <Text style={styles.saveBtnText}>Save</Text>
                                </TouchableOpacity>

                            </View>
                        )
                    }

                </View>

                <View style={styles.btn}>
                    <Text style={styles.btnText}>Reservations</Text>
                    <TouchableOpacity style={styles.arrowIcon} onPress={() => navigation.navigate('SignsScreen')}>
                        <Icons type={'profile-arrow'} active />
                    </TouchableOpacity>
                </View>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>Privacy Policy</Text>
                    <TouchableOpacity style={styles.arrowIcon} onPress={handlePrivacyPolicy}>
                        <Icons type={'profile-arrow'} active />
                    </TouchableOpacity>
                </View>

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
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 25,
        paddingTop: height * 0.07,
        paddingHorizontal: 16
    },

    add: {
        width: 36,
        height: 36
    },

    title: {
        fontWeight: '900',
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
        top: 10,
        right: 20,
        zIndex: 10
    },

    imageContainer: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: "#999",
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
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

    btn: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#999',
        paddingLeft: 16,
        paddingRight: 6
    },

    btnText: {
        fontWeight: '400',
        fontSize: 17,
        lineHeight: 23,
        color: '#f7d671', 
    },

    arrowIcon: {
        width: 36,
        height: 36,
        padding: 10,
    }

})

export default Profile;