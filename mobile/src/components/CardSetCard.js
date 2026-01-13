import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { getCategoryImage } from '../config/assets';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function CardSetCard({ title, cardCount, color, category, onPress }) {
  const categoryImage = getCategoryImage(category);

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: color }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {categoryImage && (
          <Image
            source={categoryImage}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{cardCount} cards</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  image: {
    width: '80%',
    height: '100%',
  },
  textContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

