import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type, active, pressed }) => {

  let imageSource;
  let iconStyle = [styles.icon];

  switch (type) {
    case '1':
      imageSource = require('../assets/panel/1.png');
      if (active) iconStyle.push(styles.active);
      break;
    case '2':
      imageSource = require('../assets/panel/2.png');
      if (active) iconStyle.push(styles.active);
      break;
    case '3':
      imageSource = require('../assets/panel/3.png');
      if (active) iconStyle.push(styles.active);
      break;
    case '4':
      imageSource = require('../assets/panel/4.png');
      if (active) iconStyle.push(styles.active);
      break;
    case 'fav':
      imageSource = require('../assets/icons/fav.png');
      break;
    case 'fav-black':
      imageSource = require('../assets/icons/fav-black.png');
      break;
    case 'cross':
      imageSource = require('../assets/icons/cross.png');
      break;
    case 'done':
      imageSource = require('../assets/icons/done.png');
      break;
    case 'dots':
      imageSource = require('../assets/icons/dots.png');
      break;
    case 'calendar':
      imageSource = require('../assets/icons/calendar.png');
      pressed && iconStyle.push(pressed);
      break;
    case 'calendar2':
      imageSource = require('../assets/icons/calendar2.png');
      break;
    case 'date':
      imageSource = require('../assets/icons/date.png');
      break;
    case 'time':
      imageSource = require('../assets/icons/time.png');
      break;
    case 'plus':
      imageSource = require('../assets/icons/plus.png');
      break;
    case 'back':
      imageSource = require('../assets/icons/back.png');
      break;
    case 'arrow':
      imageSource = require('../assets/icons/arrow.png');
      break;
  }

  return (
    <Image 
      source={imageSource} 
      style={iconStyle} 
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  active: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#000',
  },
  pressed: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#999',
  },
});

export default Icons;
