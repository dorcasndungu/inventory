import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import StockScreen from '../screens/StockScreen';
import SalesScreen from '../screens/SalesScreen';
import AddItemScreen from '../screens/AddItemScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import SellItemScreen from '../screens/SellItemScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a7ea4',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Inventory Management' }} 
        />
        <Stack.Screen 
          name="Stock" 
          component={StockScreen} 
          options={{ title: 'Stock Items' }} 
        />
        <Stack.Screen 
          name="Sales" 
          component={SalesScreen} 
          options={{ title: 'Sales History' }} 
        />
        <Stack.Screen 
          name="AddItem" 
          component={AddItemScreen} 
          options={{ title: 'Add New Item' }} 
        />
        <Stack.Screen 
          name="ItemDetail" 
          component={ItemDetailScreen} 
          options={{ title: 'Item Details' }} 
        />
        <Stack.Screen 
          name="SellItem" 
          component={SellItemScreen} 
          options={{ title: 'Sell Item' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
