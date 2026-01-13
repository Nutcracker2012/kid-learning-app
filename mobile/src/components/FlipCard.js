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
import { getImage } from '../config/assets';
import { getCardDataByImage } from '../config/cardData';
import speechService from '../services/speechService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function FlipCard({ name, imageKey }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingNote, setIsPlayingNote] = useState(false);
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
      // Stop note audio if playing
      if (isPlayingNote) {
        setIsPlayingNote(false);
      }
      playAudioSequence();
    }
  };

  const handleNotePress = () => {
    if (!data.note) return;
    
    if (isPlayingNote) {
      speechService.stop();
      setIsPlayingNote(false);
    } else {
      // Stop main audio if playing
      if (isPlaying) {
        setIsPlaying(false);
      }
      playNoteAudio();
    }
  };

  const playNoteAudio = () => {
    if (!data.note) return;
    
    setIsPlayingNote(true);
    
    const sequenceItems = [
      {
        text: data.note,
        lang: 'zh-CN',
        rate: 0.85,
        pitch: 1.0,
        pause: 0,
      },
    ];
    
    speechService.speakSequence(sequenceItems, {
      onEnd: () => {
        setIsPlayingNote(false);
      },
      onError: (error) => {
        console.error('Note speech error:', error);
        setIsPlayingNote(false);
      },
      onPlayingStateChange: (isPlaying) => {
        setIsPlayingNote(isPlaying);
      },
    });
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
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={handleCardPress}
          activeOpacity={0.95}
        >
          <View style={styles.backContent}>
            <TouchableOpacity
              style={[styles.audioButton, isPlaying && styles.audioButtonPlaying]}
              onPress={handleAudioPress}
            >
              <View style={styles.audioButtonInner}>
                <Text style={styles.audioIcon}>{isPlaying ? '||' : '()'}</Text>
              </View>
            </TouchableOpacity>

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
                  <TouchableOpacity
                    style={[styles.noteTTSButton, isPlayingNote && styles.noteTTSButtonPlaying]}
                    onPress={handleNotePress}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.noteTTSIcon}>🔊</Text>
                  </TouchableOpacity>
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
  audioIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
  },
  noteTTSButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  noteTTSButtonPlaying: {
    backgroundColor: '#357ABD',
  },
  noteTTSIcon: {
    fontSize: 18,
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

