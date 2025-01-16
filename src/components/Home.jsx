import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet } from "react-native"
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');
const THRESHOLD_HEIGHT = 700;
const THRESHOLD = height <= THRESHOLD_HEIGHT;

const Home = () => {
    const navigation = useNavigation();
    const [filterPressed, setFilterPressed] = useState('gold');

    return (
        <View style={styles.container}>

            <View style={{width: '100%', backgroundColor: '#f6f6f6', paddingTop: height * 0.07, paddingHorizontal: 16}}>
                <View style={styles.upperContainer}>
                    <Text style={styles.title}>Your Crowns</Text>
                    <TouchableOpacity style={styles.favBtn}>
                        <Icons type={'fav'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.panelContainer}>
                    <TouchableOpacity 
                        style={[styles.panelBtn, filterPressed === 'gold' && {backgroundColor: '#000'}]}
                        onPress={() => setFilterPressed('gold')}
                        >
                        <Text 
                            style={[styles.panelBtnText, filterPressed === 'gold' && {color: '#fff', fontWeight: '600'}]}
                            >
                                Gold
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity  
                        style={[styles.panelBtn, filterPressed === 'silver' && {backgroundColor: '#000'}]}
                        onPress={() => setFilterPressed('silver')}
                        >
                        <Text 
                            style={[styles.panelBtnText, filterPressed === 'silver' && {color: '#fff', fontWeight: '600'}]}
                            >
                                Silver
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.panelBtn, {borderRightWidth: 0}, filterPressed === 'bronze' && {backgroundColor: '#000'}]}
                        onPress={() => setFilterPressed('bronze')}
                        >
                        <Text 
                            style={[styles.panelBtnText, filterPressed === 'bronze' && {color: '#fff', fontWeight: '600'}]}
                            >
                                Bronze
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.noContainer}>
                <Image source={require('../assets/decor/crown.png')} style={styles.noImage} />
                <Text style={styles.noText}>There aren’t any beaches you add yet, you can do it now</Text>
                <TouchableOpacity style={styles.noAddBtn} onPress={() => navigation.navigate('AddCrownScreen')}>
                    <Text style={styles.noAddBtnText}>Add a crown</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start'
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
        color: '#000'
    },

    favBtn: {
        width: 28,
        height: 24
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
        color: '#000'
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
    }


})

export default Home;