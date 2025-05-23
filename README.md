# Inventory Management App

A mobile application built with React Native and Expo for managing inventory and sales tracking.

## Features

### Inventory Management
- **View Inventory**: See all items in your inventory with their names, prices, and current stock levels
- **Add Items**: Add new items to your inventory with details like name, description, units, buying price, and selling price
- **Edit Items**: Update existing item information
- **Delete Items**: Remove items from your inventory
- **Item Details**: View detailed information about each item

### Sales Management
- **Record Sales**: Sell items from your inventory with customizable descriptions
- **Payment Methods**: Support for different payment methods (Cash, M-Pesa)
- **Sales History**: View complete sales history with details
- **Sales Analytics**: See total sales amount

### User Interface
- **Tab Navigation**: Easy navigation between Home, Add Item, and Sales screens
- **Responsive Design**: Works on both mobile and web platforms
- **Real-time Updates**: Inventory and sales data update in real-time

## Technical Stack

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Firestore)
- **Image Storage**: Cloudinary
- **State Management**: React Hooks

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- Expo CLI
- Firebase account
- Cloudinary account

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npx expo start
```

4. Run on device or emulator
   - Scan the QR code with the Expo Go app on your device
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on an iOS simulator

## Usage

### Home Screen
The home screen displays all your inventory items. From here you can:
- View all items in your inventory
- Add new items by tapping the "Add New Item" button
- View item details by tapping on an item

### Add Item Screen
This screen allows you to add new items to your inventory:
- Enter item name, description, units, buying price, and selling price
- Tap "Add Item" to save the item to your inventory

### Item Details Screen
View detailed information about an item:
- See all item details
- Edit item information
- Delete the item
- Sell the item

### Sell Item Screen
Record a sale for an item:
- Enter quantity to sell
- Add a custom description for the sale
- Select payment method (Cash or M-Pesa)
- View total price
- Tap "Complete Sale" to record the sale

### Sales Screen
View your sales history:
- See total sales amount
- View all recorded sales with details
- See sale descriptions, quantities, payment methods, and dates

## Future Enhancements
- User authentication
- Barcode scanning
- Sales reports and analytics
- Inventory alerts for low stock
- Multiple currency support
- Offline mode
