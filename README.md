# 💰 Donation Counter

A modern, responsive web application for tracking donation amounts built with Next.js, React, TypeScript, and Tailwind CSS. Features animated counters and local data storage.

## Features

- ✨ **Modern UI**: Beautiful gradient design with glass-morphism effects
- 💰 **Donation Tracking**: Track total donations in Indonesian Rupiah (IDR)
- 📊 **Animated Counters**: Smooth number animations when values update
- 💾 **Local Storage**: All donation data stored locally in your browser
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ➕ **Add Donations**: Easy form to add new donations with donor name and optional message
- 📋 **Donation History**: View all recent donations with timestamps
- 🗑️ **Delete Donations**: Remove donations with confirmation
- 🎯 **Goal Tracking**: Set and display monthly donation goals
- 🏆 **Real-time Stats**: Instant updates to totals and donor count

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) with your browser to see the Donation Counter app.

## Usage

1. **View Stats**: See animated counters for total donations, number of donors, and monthly goal
2. **Add Donations**: 
   - Click the "Add Donation" button
   - Enter the donation amount in Rupiah
   - Add the donor's name
   - Optionally include a message
   - Click "Add Donation" to save
3. **View History**: Scroll down to see all recent donations with timestamps
4. **Delete Donations**: Click the "✕" button next to any donation to remove it
5. **Data Persistence**: All data is automatically saved to your browser's local storage

## Data Storage

- All donation data is stored locally in your browser using localStorage
- Data persists between browser sessions
- No external database or server required
- Data includes donation amount, donor name, optional message, and timestamp

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Development**: ESLint for code quality
- **Fonts**: Roboto from Google Fonts
- **Storage**: Browser localStorage API

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Features in Detail

### Animated Counters
- Smooth number animations using Intersection Observer API
- Automatic formatting for Indonesian Rupiah currency
- Plus signs for donor counts
- Responsive design for all screen sizes

### Form Validation
- Required fields for amount and donor name
- Automatic number formatting with thousand separators
- Input sanitization to prevent invalid data

### Data Management
- Automatic saving to localStorage
- Error handling for data corruption
- Sorting by timestamp (newest first)
- Unique ID generation for each donation
