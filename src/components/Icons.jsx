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
      if (active) iconStyle.push(styles.active);
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
      if (active) iconStyle.push(styles.active);
      break;
    case 'calendar2':
      imageSource = require('../assets/icons/calendar2.png');
      break;
    case 'date':
      imageSource = require('../assets/icons/date.png');
      if (active) iconStyle.push(styles.active);
      break;
    case 'time':
      imageSource = require('../assets/icons/time.png');
      if (active) iconStyle.push(styles.active);
      break;
    case 'plus':
      imageSource = require('../assets/icons/plus.png');
      if (active) iconStyle.push(styles.active);
      break;
    case 'back':
      imageSource = require('../assets/icons/back.png');
      if (active) iconStyle.push(styles.active);
      break;
    case 'done':
      imageSource = require('../assets/decor/done.png');
      if (active) iconStyle.push(styles.active);
      break;
    case 'arrow':
      imageSource = require('../assets/icons/arrow.png');
      if (active) iconStyle.push(styles.active);
      break;
    case 'profile-arrow':
      imageSource = require('../assets/icons/profile-arrow.png');
      if (active) iconStyle.push(styles.active);
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
    tintColor: '#f7d671',
  },
  pressed: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#999',
  },
});

export default Icons;
