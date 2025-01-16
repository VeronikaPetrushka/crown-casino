import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Dimensions, StyleSheet, ScrollView } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const AddCrown = () => {
    const navigation = useNavigation();
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [filterChosen, setFilterChosen] = useState('gold');
    const [image, setImage] = useState(null);
    const [jewels, setJewels] = useState([]);
    const [saved, setSaved] = useState(false);

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
        if (!heading || !description || !image) {
            alert('Please fill out the heading, description, and add an image.');
            return;
        }
    
        const validJewels = jewels.filter(jewel => jewel.heading.trim() && jewel.description.trim());
    
        const crown = {
            heading,
            description,
            filterChosen,
            image,
            jewels: validJewels,
        };
    
        try {
            const existingCrowns = await AsyncStorage.getItem('crowns');
            const crowns = existingCrowns ? JSON.parse(existingCrowns) : [];
    
            crowns.push(crown);
    
            await AsyncStorage.setItem('crowns', JSON.stringify(crowns));

            console.log(crowns)
    
            setSaved(true);
        } catch (error) {
            console.error('Error saving crown:', error);
            alert('Failed to save the crown. Please try again.');
        }
    };    

    return (
        <View style={styles.container}>

            {
                saved ? (
                    <View style={{flex: 1, padding: 16, paddingTop: height * 0.07, paddingBottom: 85, alignItems: 'flex-start'}}>
                        <TouchableOpacity style={{width: 44, height: 44, marginLeft: -38}} onPress={() => navigation.goBack('')}>
                            <Icons type={'back'} />
                        </TouchableOpacity>
                        <Text style={[styles.title, {fontSize: 44, marginTop: 22, lineHeight: 53, marginBottom: 70}]}>Crown is successfully added</Text>
                        <Image source={require('../assets/decor/done.png')} style={{ width: 120, height: 120, alignSelf: 'center'}} />
                        <View style={styles.saveBtnContainer}>
                            <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.navigate('HomeScreen')}>
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
                            <Text style={styles.title}>Add a crown</Text>
                        </View>

                        <ScrollView style={{width: '100%'}}>
                            <Text style={styles.label}>Heading</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Crown name"
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
                                    placeholder="Crown description"
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

                            <View style={styles.panelContainer}>
                                <TouchableOpacity 
                                    style={[styles.panelBtn, filterChosen === 'gold' && {backgroundColor: '#000'}]}
                                    onPress={() => setFilterChosen('gold')}
                                    >
                                    <Text 
                                        style={[styles.panelBtnText, filterChosen === 'gold' && {color: '#fff', fontWeight: '600'}]}
                                        >
                                            Gold
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity  
                                    style={[styles.panelBtn, filterChosen === 'silver' && {backgroundColor: '#000'}]}
                                    onPress={() => setFilterChosen('silver')}
                                    >
                                    <Text 
                                        style={[styles.panelBtnText, filterChosen === 'silver' && {color: '#fff', fontWeight: '600'}]}
                                        >
                                            Silver
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.panelBtn, {borderRightWidth: 0}, filterChosen === 'bronze' && {backgroundColor: '#000'}]}
                                    onPress={() => setFilterChosen('bronze')}
                                    >
                                    <Text 
                                        style={[styles.panelBtnText, filterChosen === 'bronze' && {color: '#fff', fontWeight: '600'}]}
                                        >
                                            Bronze
                                    </Text>
                                </TouchableOpacity>
                            </View>

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
                                        <Icons type={'plus'} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {jewels.map((jewel, index) => (
                                <View key={jewel.id} style={styles.jewelItem}>
                                    <Text style={styles.label}>Jewel {index + 1}</Text>
                                    <Text style={styles.jewelLabel}>Heading</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Name"
                                            placeholderTextColor="#999"
                                            value={jewel.heading}
                                            onChangeText={(text) => {
                                                const updatedJewels = [...jewels];
                                                updatedJewels[index].heading = text;
                                                setJewels(updatedJewels);
                                            }}
                                        />
                                        {jewel.heading ? (
                                            <TouchableOpacity style={styles.cross} onPress={() => {
                                                const updatedJewels = [...jewels];
                                                updatedJewels[index].heading = '';
                                                setJewels(updatedJewels);
                                            }}>
                                                <Icons type={'cross'} />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>

                                    <Text style={styles.jewelLabel}>Description</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Description"
                                            placeholderTextColor="#999"
                                            value={jewel.description}
                                            onChangeText={(text) => {
                                                const updatedJewels = [...jewels];
                                                updatedJewels[index].description = text;
                                                setJewels(updatedJewels);
                                            }}
                                            multiline
                                        />
                                        {jewel.description ? (
                                            <TouchableOpacity style={styles.cross} onPress={() => {
                                                const updatedJewels = [...jewels];
                                                updatedJewels[index].description = '';
                                                setJewels(updatedJewels);
                                            }}>
                                                <Icons type={'cross'} />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity onPress={() => setJewels([...jewels, { id: jewels.length + 1, heading: '', description: '' }])}>
                                <Text style={styles.addJewelText}>+ Add jewel</Text>
                            </TouchableOpacity>

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
        top: 10,
        right: 20,
        zIndex: 10
    },

    panelContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#ececec'
    },

    panelBtn: {
        width: '33.33%',
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
        color: '#000'
    },

    imageContainer: {
        width: 100,
        height: 150,
        backgroundColor: '#fff',
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

    addJewelText: {
        fontWeight: '400',
        fontSize: 18,
        lineHeight: 21.5,
        color: '#000',
        alignSelf: 'center',
        marginBottom: 30
    },

    jewelItem: { 
        width: '100%', 
        alignItems: 'flex-start', 
        backgroundColor: '#fff', 
        marginBottom: 24,
        padding: 16
    },

    jewelLabel: {
        fontSize: 16, 
        fontWeight: '400',
        alignSelf: 'flex-start', 
        marginBottom: 8, 
        lineHeight: 19, 
        color: '#000'
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
    }

})

export default AddCrown;