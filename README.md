# Decentralized Prediction Market Platform

A modern, decentralized prediction market platform built with Next.js, TypeScript, and ThirdWeb. This platform allows users to create, participate in, and resolve prediction markets on the blockchain.

## Features

### Core Functionality
- **Market Participation**: Buy and trade shares in prediction markets
- **Real-time Updates**: Live updates of market status and share prices

### User Interface
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI Components**: Built with Radix UI and Tailwind CSS
- **Interactive Dashboard**: Tabbed interface for different market states
- **Loading States**: Skeleton loading for better user experience
- **Progress Tracking**: Visual indicators for market progress and time remaining

### Market States
- **Active Markets**: Currently open for trading
- **Pending Resolution**: Markets awaiting outcome resolution
- **Resolved Markets**: Completed markets with final outcomes

### Technical Features
- **Blockchain Integration**: Built on ThirdWeb for seamless blockchain interaction
- **Type Safety**: Full TypeScript support for better development experience
- **Modern Stack**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom animations and transitions
- **Component Architecture**: Modular and reusable components

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Web3 wallet (e.g., MetaMask)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/decentralized-stake.git
cd decentralized-stake
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your environment variables:
```
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── ...          # Feature-specific components
├── constants/       # Constants and configurations
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and helpers
└── types/          # TypeScript type definitions
```

## Contributors

- **[Kushal Desai (23CS019)](https://github.com/KushalvDesai)**
- **[Jeet Dhaduk (23CS020)](https://github.com/23CS020DhadukJeet)**

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [ThirdWeb](https://thirdweb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
