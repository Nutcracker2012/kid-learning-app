import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { getImage } from '../config/assets';
import { getCardDataByImage } from '../config/cardData';
import speechService from '../services/speechService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function FlipCard({ name, imageKey }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const cardImage = getImage(imageKey);
  const cardData = getCardDataByImage(imageKey);

  const defaultData = {
    nameEnglish: name,
    nameChinese: '',
    pronunciation: '',
    note: '',
    recognitionFeatures: [],
    funFact: '',
  };

  const data = cardData || defaultData;

  const flipToBack = () => {
    Animated.spring(flipAnimation, {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(true);
  };

  const flipToFront = () => {
    Animated.spring(flipAnimation, {
      toValue: 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(false);
  };

  const handleCardPress = () => {
    if (isFlipped) {
      flipToFront();
    } else {
      flipToBack();
    }
  };

  const handleAudioPress = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
    } else {
      playAudioSequence();
    }
  };

  const playAudioSequence = () => {
    setIsPlaying(true);

    // Build sequence and filter out empty text
    const sequenceItems = [
      // English name
      data.nameEnglish && {
        text: data.nameEnglish,
        lang: 'en-US',
        rate: 0.8,
        pitch: 1.1,
        pause: 800,
      },
      // Chinese name
      data.nameChinese && {
        text: data.nameChinese,
        lang: 'zh-CN',
        rate: 0.85,
        pitch: 1.0,
        pause: 800,
      },
      // Pronunciation practice
      data.nameEnglish && {
        text: `${data.nameEnglish}. ${data.nameEnglish}.`,
        lang: 'en-US',
        rate: 0.6,
        pitch: 1.1,
        pause: 1000,
      },
      // Recognition features
      ...(data.recognitionFeatures || []).map((feature, index) => {
        const parts = feature.split('-');
        const label = parts[0]?.trim() || '';
        const description = parts[1]?.trim() || '';
        const text = `${label}. ${description}`.trim();
        return text ? {
          text,
          lang: 'zh-CN',
          rate: 0.8,
          pitch: 1.0,
          pause: index === data.recognitionFeatures.length - 1 ? 800 : 600,
        } : null;
      }),
      // Fun fact
      data.funFact && {
        text: data.funFact,
        lang: 'zh-CN',
        rate: 0.85,
        pitch: 1.0,
        pause: 0,
      },
    ].filter(item => item && item.text && item.text.trim().length > 0);

    if (sequenceItems.length === 0) {
      console.warn('No valid text to speak');
      setIsPlaying(false);
      return;
    }

    speechService.speakSequence(sequenceItems, {
      onEnd: () => {
        setIsPlaying(false);
      },
      onError: (error) => {
        console.error('Speech error:', error);
        setIsPlaying(false);
      },
      onPlayingStateChange: (isPlaying) => {
        setIsPlaying(isPlaying);
      },
    });
  };

  // Animation interpolations
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <View style={styles.container}>
      {/* Front of card */}
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={handleCardPress}
          activeOpacity={0.95}
        >
          <View style={styles.imageSection}>
            {cardImage && (
              <Image
                source={cardImage}
                style={styles.cardImage}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.cardTitle}>{name}</Text>
            <View style={styles.flipIndicator}>
              <Text style={styles.flipIndicatorText}>{'>'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Back of card */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={styles.cardTouchable}
            onPress={handleCardPress}
            activeOpacity={0.95}
          >
            <View style={styles.backContent}>

            <View style={styles.nameSection}>
              <Text style={styles.englishName}>{data.nameEnglish}</Text>
              {data.nameChinese && (
                <Text style={styles.chineseName}>({data.nameChinese})</Text>
              )}
            </View>

            {data.pronunciation && (
              <Text style={styles.pronunciation}>{data.pronunciation}</Text>
            )}

            {data.note && (
              <View style={styles.noteSection}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteLabel}>Note:</Text>
                </View>
                <Text style={styles.noteText}>{data.note}</Text>
              </View>
            )}

            {data.funFact && (
              <View style={styles.funFactSection}>
                <Text style={styles.funFactLabel}>Fun Fact:</Text>
                <Text style={styles.funFactText}>{data.funFact}</Text>
              </View>
            )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.audioButton, isPlaying && styles.audioButtonPlaying]}
            onPress={handleAudioPress}
            activeOpacity={0.8}
          >
            <View style={styles.audioButtonInner}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                {isPlaying ? (
                  <Path
                    d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
                    fill="white"
                  />
                ) : (
                  <Path
                    d="M13.4961 1.50635C13.6942 1.50635 13.8849 1.58541 14.0254 1.7251C14.1664 1.86349 14.2471 2.05194 14.25 2.24951V21.7495C14.25 21.9484 14.1709 22.1391 14.0303 22.2798C13.8896 22.4204 13.6989 22.4995 13.5 22.4995C13.4008 22.4991 13.3023 22.4795 13.2109 22.4409C13.1197 22.4023 13.0372 22.3456 12.9678 22.2749L7.25293 16.4995H2.25C2.05109 16.4995 1.86038 16.4204 1.71973 16.2798C1.57913 16.1391 1.5 15.9484 1.5 15.7495V8.24951C1.50005 8.05066 1.57912 7.85985 1.71973 7.71924C1.86037 7.57864 2.05113 7.49951 2.25 7.49951H7.25293L12.9678 1.7251C13.1083 1.58545 13.298 1.50639 13.4961 1.50635ZM8.09277 8.7749C8.02331 8.84577 7.94004 8.9023 7.84863 8.94092C7.7573 8.97947 7.6587 8.9991 7.55957 8.99951H3V14.9995H7.55957C7.65878 14.9999 7.75724 15.0205 7.84863 15.0591C7.94004 15.0977 8.02331 15.1542 8.09277 15.2251L12.75 19.9272V4.07178L8.09277 8.7749ZM20.3701 6.09033C21.7852 7.76631 22.5394 9.90131 22.4912 12.0942C22.4429 14.2874 21.5952 16.3883 20.1074 18.0005L19.0049 16.9497C20.2437 15.6063 20.9502 13.8568 20.9902 12.0298C21.0302 10.2029 20.4014 8.42421 19.2227 7.02783L20.3701 6.06006V6.09033ZM17.3252 8.03271C18.2696 9.14997 18.773 10.574 18.7412 12.0366C18.7094 13.4992 18.1444 14.8999 17.1523 15.9751L16.0498 14.9546C16.7941 14.1491 17.2192 13.0998 17.2441 12.0034C17.269 10.9068 16.8917 9.83803 16.1846 8.99951L17.3252 8.03271Z"
                    fill="white"
                  />
                )}
              </Svg>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    backgroundColor: '#FFF8F0',
  },
  cardWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  cardTouchable: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardImage: {
    width: '70%',
    height: '90%',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D2D2D',
    flex: 1,
  },
  flipIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipIndicatorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backContent: {
    flex: 1,
    padding: 24,
  },
  audioButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  audioButtonPlaying: {
    backgroundColor: '#E74C3C',
  },
  audioButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameSection: {
    marginTop: 50,
    marginBottom: 8,
  },
  englishName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  chineseName: {
    fontSize: 20,
    color: '#666',
    marginTop: 4,
  },
  pronunciation: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  noteSection: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  noteHeader: {
    marginBottom: 8,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
  },
  noteText: {
    fontSize: 15,
    color: '#2D2D2D',
    lineHeight: 22,
  },
  funFactSection: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
  },
  funFactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  funFactText: {
    fontSize: 15,
    color: '#2D2D2D',
    lineHeight: 22,
  },
});

