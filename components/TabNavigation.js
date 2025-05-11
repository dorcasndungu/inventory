import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Bottom tab navigation component
 * @param {Object} props - Component props
 * @param {string} props.activeScreen - Current active screen
 * @param {Function} props.onHomePress - Function to handle home press
 * @param {Function} props.onAddPress - Function to handle add press
 * @param {Function} props.onSalesPress - Function to handle sales press
 * @returns {JSX.Element} - Tab navigation component
 */
const TabNavigation = ({ activeScreen, onHomePress, onAddPress, onSalesPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.tabButton, 
          activeScreen === 'home' && styles.activeTab
        ]} 
        onPress={onHomePress}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={activeScreen === 'home' ? '#0a7ea4' : '#666'} 
        />
        <Text 
          style={[
            styles.tabText, 
            activeScreen === 'home' && styles.activeTabText
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.tabButton, 
          activeScreen === 'addItem' && styles.activeTab
        ]} 
        onPress={onAddPress}
      >
        <Ionicons 
          name="add-circle" 
          size={24} 
          color={activeScreen === 'addItem' ? '#0a7ea4' : '#666'} 
        />
        <Text 
          style={[
            styles.tabText, 
            activeScreen === 'addItem' && styles.activeTabText
          ]}
        >
          Add Item
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.tabButton, 
          activeScreen === 'sales' && styles.activeTab
        ]} 
        onPress={onSalesPress}
      >
        <Ionicons 
          name="cash" 
          size={24} 
          color={activeScreen === 'sales' ? '#0a7ea4' : '#666'} 
        />
        <Text 
          style={[
            styles.tabText, 
            activeScreen === 'sales' && styles.activeTabText
          ]}
        >
          Sales
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 60,
    paddingBottom: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#0a7ea4',
    backgroundColor: '#f0f9ff',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeTabText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
});

export default TabNavigation;
