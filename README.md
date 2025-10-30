# MGNREGA Performance Tracker

A comprehensive web application that makes MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance data accessible to citizens across India. The application provides an intuitive interface for low-literacy populations to understand their district's performance in the world's largest employment guarantee program.

## Features

### 🎯 User-Centric Design
- **Low-Literacy Friendly**: Simple icons, visual representations, and intuitive navigation
- **Automatic Location Detection**: Automatically identifies user's district using geolocation
- **Multilingual Support**: Hindi and English language support
- **Mobile-First Design**: Responsive design optimized for smartphones

### 📊 Comprehensive Data Visualization
- **Performance Metrics**: Work demand rates, provision rates, completion rates
- **Historical Trends**: Monthly performance data with interactive charts
- **Inclusive Development**: SC, ST, and women participation tracking
- **Financial Transparency**: Expenditure breakdown and budget allocation

### 🏗️ Production-Ready Architecture
- **Data Caching**: Local database with API fallback mechanisms
- **Scalable Backend**: Express.js with SQLite database
- **Rate Limiting**: Protection against abuse and DDoS attacks
- **Error Handling**: Comprehensive error handling and logging
- **Security**: HTTPS, input validation, and security headers

## 🖼️ Interface Design for Low-Literacy Rural India

This application is designed to be easily used by citizens with low-data literacy or those unfamiliar with government terms. Here’s how the design helps:

- **Icons and Visuals:** Key numbers and trends are shown with big, colorful icons, smiley/frown faces, and simple charts so people don’t have to read much.
- **Minimal Text:** We use short labels and larger fonts, making it easy to scan.
- **Local Languages:** Information is provided in Hindi and English, with simple words and visual cues.
- **Audio Explanation:** The system is ready for future upgrades where a user can tap a button and listen to a short spoken explanation of the data.
- **One-Tap Navigation:** Finding your district is very easy: you can either search by typing, or just tap a button to have your location auto-detected.
- **Tooltips and Info Dots:** For users who want to learn more, small ‘?’ icons and popups provide easy explanations (“What is a person day?”, etc).
- **Mobile & Offline Friendly:** The design works on any mobile phone and can load data even with slow or unreliable internet.

All these together ensure that even citizens with very little experience in using websites, or limited reading skills, can confidently use the app to see local government performance.

## 🖥️ Technical Architecture Decisions for Scale

We have made several decisions to ensure this website is reliable, secure, and always available—even if millions use it or the government data source has problems:

- **Local Database, Not Just API:** Instead of directly relying on the government API for every user, we automatically fetch and store data in a database whenever the API is available. This protects users from errors and delays if the API is down or slow.
- **Scheduled Data Synchronization:** The system updates data from the main API every few hours. If the API is not available, we safely re-use the latest locally saved data, so the site is never blank or broken.
- **Caching and Fast Delivery:** The backend caches results and compresses responses, so pages load quickly even for thousands of users.
- **Security Protections:** Rate limits, input validation, and security headers help prevent hacking and misuse.
- **Scalable Design:** All services (backend, frontend, database) can be run on cloud servers or containers (via Docker) and the website can be protected by nginx to distribute load.
- **Choice of Tech:**
  - *SQLite* is used for demo simplicity (easy to run), but we can swap in PostgreSQL or MySQL instantly at scale.
  - *React* on the frontend gives a smooth, app-like experience and is easy to add more regional languages.
  - *Docker* and nginx make it easy to deploy and scale in real-world servers.

These choices ensure that whether 1,000 or 10,000,000 Indians use the site, it stays reliable and secure.

## 🚶 Walkthrough of the Implementation and Code

Here’s a story of how everything fits together:

- **Frontend (React)**: The user opens the website (on mobile or desktop). The home page shows a simple search box or a “Find my District” button that uses GPS. District and state lists come from the backend. When a user selects a district, they see a visual dashboard of MGNREGA stats for their home area, with charts for trends, big numbers, and color indicators for good/bad performance.
  - If internet is slow, results still show—because they are cached locally.

- **Backend (Express.js)**: Whenever new data is needed, the backend gets it from the local database. Every 6 hours (or when triggered by an admin), the backend downloads the latest trusted MGNREGA figures from the govt API, formats them, and puts them into the correct district/year/month buckets in the database.
  - If the main API is down or slow, old data is served and users are notified (“showing yesterday’s data”).
  - The backend protects against too many requests (rate limiting) and logs errors for review.

- **Database (SQLite for demo, upgrade-ready):** All performance data (person days, expenditure, completion rates, etc.), regional information (district/state names, GPS points), and sync logs are in the database. This keeps user experience fast and safe against API downtime.

- **DevOps & Deployment:** To handle big traffic, everything can run on scalable cloud servers with Docker and nginx. Health checks monitor problems, and logs keep track of the site’s health. Security controls are in place at every layer.

**Summary:**
- Any citizen can find their district with just a few taps.
- Even if the government servers are down, users can see recent data.
- Clean code—well-separated backend, frontend, and database—makes adding more states, languages, or features easy in the future.

This setup ensures MGNREGA data is truly accessible to every Indian—whether tech-savvy or not.

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **SQLite** database for data storage
- **Winston** for logging
- **Node-cron** for scheduled data synchronization
- **Helmet** for security headers
- **Rate limiting** for API protection

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Chart.js** for data visualization
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Framer Motion** for animations

### Data Management
- **Automated API Integration** with data.gov.in
- **Local Data Caching** for reliability
- **Fallback Mechanisms** for API downtime
- **Real-time Updates** every 6 hours

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mgnrega-performance-tracker
```

### 2. Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/mgnrega.db
DATA_GOV_API_KEY=your-api-key-here
LOG_LEVEL=info
```

### 4. Initialize Database
The database will be automatically created and populated with sample data on first run.

### 5. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
mgnrega-performance-tracker/
├── server.js                 # Main server file
├── package.json              # Server dependencies
├── src/
│   ├── database/
│   │   └── db.js            # Database configuration and queries
│   ├── routes/
│   │   └── index.js         # API routes
│   ├── services/
│   │   └── dataSync.js      # Data synchronization service
│   └── utils/
│       └── logger.js        # Logging utility
├── client/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── App.js          # Main App component
│   └── package.json        # Client dependencies
├── data/                    # Database files
└── logs/                   # Application logs
```

## API Endpoints

### States and Districts
- `GET /api/states` - Get all states
- `GET /api/districts` - Get all districts
- `GET /api/districts/:stateCode` - Get districts by state
- `GET /api/search?q=query` - Search districts

### Performance Data
- `GET /api/summary/:districtCode` - Get district summary
- `GET /api/performance/:districtCode` - Get detailed performance data
- `GET /api/trends/:districtCode` - Get historical trends
- `GET /api/state-comparison/:stateCode` - Get state-wide comparison

### System
- `GET /api/sync-status` - Get data synchronization status
- `GET /health` - Health check endpoint

## Data Model

### States Table
- `id` - Primary key
- `state_code` - State code (e.g., 'UP')
- `state_name` - State name (e.g., 'Uttar Pradesh')

### Districts Table
- `id` - Primary key
- `district_code` - District code (e.g., 'UP001')
- `district_name` - District name
- `state_code` - Foreign key to states
- `latitude`, `longitude` - Geographic coordinates

### MGNREGA Data Table
- `id` - Primary key
- `district_code` - Foreign key to districts
- `financial_year` - Financial year (e.g., '2024-25')
- `month` - Month name
- `total_households` - Total registered households
- `households_demanding_work` - Households demanding work
- `households_provided_work` - Households provided work
- `total_person_days` - Total person-days generated
- `sc_person_days`, `st_person_days`, `women_person_days` - Category-wise participation
- `total_works`, `completed_works`, `ongoing_works` - Work statistics
- `total_expenditure`, `wage_expenditure`, `material_expenditure`, `admin_expenditure` - Financial data

## Key Features Explained

### 1. Automatic Location Detection
- Uses HTML5 Geolocation API to get user coordinates
- Calculates nearest district using Haversine formula
- Provides fallback to manual district selection
- Respects user privacy with permission requests

### 2. Data Synchronization
- Scheduled synchronization every 6 hours
- Fallback to sample data when API is unavailable
- Comprehensive error handling and logging
- Data validation and sanitization

### 3. Performance Metrics
- **Work Demand Rate**: Percentage of households demanding work
- **Work Provision Rate**: Percentage of demanding households provided work
- **Work Completion Rate**: Percentage of works completed
- **Participation Rates**: SC, ST, and women participation percentages

### 4. Visual Data Representation
- Interactive line charts for trends
- Doughnut charts for expenditure and participation breakdown
- Color-coded metrics for easy understanding
- Responsive charts for mobile devices

## Deployment

### Production Deployment
1. Set `NODE_ENV=production`
2. Configure proper database path
3. Set up SSL certificates
4. Configure reverse proxy (nginx)
5. Set up monitoring and logging
6. Configure backup strategies

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN cd client && npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Acknowledgments

- Government of India for providing open APIs
- Data.gov.in for MGNREGA data access
- The rural communities of India who benefit from MGNREGA
- Open source community for the tools and libraries used

