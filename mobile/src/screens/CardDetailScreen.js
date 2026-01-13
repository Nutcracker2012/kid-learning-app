import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FlipCard from '../components/FlipCard';
import { cardSets } from '../config/cardData';

const { width } = Dimensions.get('window');

export default function CardDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { setId } = route.params || { setId: 'dinosaur' };
  
  const cardSet = cardSets[setId] || cardSets.dinosaur;

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{cardSet.title}</Text>
            <Text style={styles.cardCount}>{cardSet.cardCount} Cards</Text>
          </View>
          <Text style={styles.description}>{cardSet.description}</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>O</Text>
            <Text style={styles.searchPlaceholder}>Search cards</Text>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          {cardSet.cards.map((card) => (
            <FlipCard
              key={card.id}
              name={card.name}
              imageKey={card.image}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D2D2D',
  },
  headerSpacer: {
    flex: 1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addIcon: {
    fontSize: 24,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D2D2D',
    marginRight: 12,
  },
  cardCount: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 18,
    color: '#999',
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
});

