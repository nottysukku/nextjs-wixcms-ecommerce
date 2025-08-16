# 🚀🛒 Headless E-commerce Store | Next.js + Wix CMS Integration

A modern, full-featured e-commerce web application built with Next.js 14 and Wix Headless CMS, designed for speed, scalability, and seamless user experience.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Wix](https://img.shields.io/badge/Wix_Headless-CMS-orange?style=for-the-badge&logo=wix)

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend/CMS**: Wix Headless CMS
- **State Management**: Custom hooks with React Context
- **Authentication**: Client-Side Auth with Wix SDK
- **Notifications**: React Toastify
- **APIs**: REST APIs with Wix SDK
- **Deployment**: Vercel (recommended)

## ✨ Features

### 🏠 Homepage & Navigation
- **Auto-rotating Image Slider** with smooth transitions
- **Featured Products** showcase with hover effects
- **Dynamic Category Filtering** with horizontal scroll
- **Responsive Navigation** optimized for all devices

### 📦 Product Management
- **Smart Product Listings** with pagination
- **Real-time Filtering** by price, category, and update date
- **Searchable URLs** for shareable product results
- **Stock-aware Option Selection** (color, size, quantity)
- **Low-stock Alerts** and inventory management
- **Rich Product Galleries** with zoom functionality

### 🛒 Shopping Experience
- **Guest Cart Support** with browser token persistence
- **Authenticated User Cart** with full sync across devices
- **Secure Checkout Flow** with shipping options
- **Multi-provider Payment Support**
- **No Account Required** for guest checkout

### 👤 User Management
- **Complete Authentication Flow**: Sign up, login, logout
- **Email Verification** system
- **Password Reset** functionality
- **User Profile Management**
- **Order History** tracking

### 🎨 UI Components
- **Responsive Navigation** with mobile menu
- **Product Image Carousel** with smooth transitions
- **Interactive Cart Modal** with real-time updates
- **Advanced Product Filtering** with multiple criteria
- **Loading Skeletons** for improved UX
- **Search Functionality** with instant results

### 🔧 Architecture Features
- **Server Actions** for optimized data handling
- **React Context** for state management
- **Custom Hooks** for reusable logic
- **Middleware** for request handling
- **Dynamic Routing** with slug-based URLs

### 🔧 Backend Integration
- **Wix Headless CMS** for content management
- **Effortless Data Fetching** using Wix SDK
- **Real-time Inventory** synchronization
- **Automated Order Management**
- **Scalable Infrastructure** without manual deployments

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Wix Developer Account
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nottysukku/nextjs-wixcms-ecommerce.git
   cd nextjs-wixcms-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Copy the example environment file and configure your variables:
   ```bash
   cp .env.example .env
   ```
   
   Update your `.env` file with your credentials:
   ```env
   NEXT_PUBLIC_WIX_CLIENT_ID=your_wix_client_id
   NEXT_PUBLIC_WIX_APP_ID=your_wix_app_id
   NEXT_PUBLIC_FERA_ID=your_fera_id
   ```

4. **Configure Wix Integration**
   - Create a new Wix Headless project
   - Enable eCommerce and Members APIs
   - Copy your Client ID and App ID from Wix Dashboard
   - Configure your domain in Wix settings

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── .env                       # Environment variables
├── .env.example              # Environment variables template
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── next.config.mjs           # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Project documentation
│
├── public/                   # Static assets
│   ├── cart.png             # Cart icon
│   ├── category.png         # Category icon
│   ├── discover.png         # Discover card icon
│   ├── facebook.png         # Facebook social icon
│   ├── instagram.png        # Instagram social icon
│   ├── logo.png             # Brand logo
│   ├── mastercard.png       # Mastercard payment icon
│   ├── menu.png             # Menu hamburger icon
│   ├── notification.png     # Notification bell icon
│   ├── paypal.png           # PayPal payment icon
│   ├── pinterest.png        # Pinterest social icon
│   ├── product.png          # Product placeholder
│   ├── profile.png          # User profile icon
│   ├── search.png           # Search icon
│   ├── skrill.png           # Skrill payment icon
│   ├── star.png             # Rating star icon
│   ├── visa.png             # Visa payment icon
│   ├── woman.png            # Hero/banner image
│   ├── x.png                # X (Twitter) social icon
│   └── youtube.png          # YouTube social icon
│
└── src/
    ├── middleware.ts         # Next.js middleware
    │
    ├── app/                  # Next.js App Router
    │   ├── favicon1.jpg      # Custom favicon
    │   ├── globals.css       # Global styles
    │   ├── layout.tsx        # Root layout
    │   ├── page.tsx          # Homepage
    │   ├── list/             # Product listing page
    │   │   └── page.tsx
    │   ├── login/            # Authentication page
    │   │   └── page.tsx
    │   ├── orders/           # Order management
    │   │   └── [id]/         # Individual order page
    │   │       └── page.tsx
    │   ├── profile/          # User profile page
    │   │   └── page.tsx
    │   ├── success/          # Success/confirmation page
    │   │   └── page.tsx
    │   └── [slug]/           # Dynamic product pages
    │       └── page.tsx
    │
    ├── components/           # Reusable UI components
    │   ├── Add.tsx           # Add to cart component
    │   ├── CartModal.tsx     # Shopping cart modal
    │   ├── CategoryList.tsx  # Category navigation
    │   ├── CustomizeProducts.tsx # Product customization
    │   ├── Filter.tsx        # Product filtering
    │   ├── Footer.tsx        # Site footer
    │   ├── Menu.tsx          # Navigation menu
    │   ├── Navbar.tsx        # Top navigation bar
    │   ├── NavIcons.tsx      # Navigation icons
    │   ├── Pagination.tsx    # Pagination component
    │   ├── ProductImages.tsx # Product image gallery
    │   ├── ProductList.tsx   # Product grid/list
    │   ├── Reviews.tsx       # Product reviews
    │   ├── SearchBar.tsx     # Search functionality
    │   ├── Skeleton.tsx      # Loading skeleton
    │   ├── Slider.tsx        # Image slider/carousel
    │   └── UpdateButton.tsx  # Update actions
    │
    ├── context/              # React Context
    │   └── wixContext.tsx    # Wix client context
    │
    ├── hooks/                # Custom React hooks
    │   ├── useCartStore.ts   # Cart state management
    │   └── useWixClient.tsx  # Wix client hook
    │
    └── lib/                  # Utility functions
        ├── actions.ts        # Server actions
        └── wixClientServer.ts # Server-side Wix client
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WIX_CLIENT_ID` | Wix application client ID | ✅ |
| `NEXT_PUBLIC_WIX_APP_ID` | Wix application ID | ✅ |
| `NEXT_PUBLIC_FERA_ID` | Fera reviews integration ID | ✅ |

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Tailwind CSS** for consistent styling

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile devices** (320px and up)
- **Tablets** (768px and up)  
- **Desktop** (1024px and up)
- **Large screens** (1440px and up)

## 🔒 Security Features

- **Client-side Authentication** with secure token handling
- **Input Validation** on all forms
- **XSS Protection** with sanitized content
- **HTTPS Enforcement** in production
- **Secure Payment Processing** through Wix

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Wix** for providing the headless CMS platform
- **Vercel** for excellent deployment experience
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/nottysukku/nextjs-wixcms-ecommerce/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nottysukku/nextjs-wixcms-ecommerce/discussions)
- **Email**: sukritchopra2003@gmail.com

## 🔗 Links


- **Documentation**: [Wix Headless CMS Docs](https://dev.wix.com/api/rest/getting-started/introduction)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)

---

⭐ **Star this repository** if you found it helpful!

Made with ❤️ by [Nottysukku](https://github.com/nottysukku)