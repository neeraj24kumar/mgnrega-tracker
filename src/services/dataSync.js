const axios = require('axios');
const cron = require('node-cron');
const { runQuery, getQuery, allQuery } = require('../database/db');
const logger = require('../utils/logger');

// MGNREGA API configuration
const MGNREGA_API_BASE = 'https://api.data.gov.in/resource/';
const API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e4d4b4a50f3027b1e4c6b61c8';

// Sample data for Uttar Pradesh districts (since API might be unreliable)
const SAMPLE_DISTRICTS = [
  { code: 'UP001', name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { code: 'UP002', name: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8974, lng: 78.0880 },
  { code: 'UP003', name: 'Allahabad', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
  { code: 'UP004', name: 'Ambedkar Nagar', state: 'Uttar Pradesh', lat: 26.4056, lng: 82.6969 },
  { code: 'UP005', name: 'Amethi', state: 'Uttar Pradesh', lat: 26.1500, lng: 81.8000 },
  { code: 'UP006', name: 'Amroha', state: 'Uttar Pradesh', lat: 28.9030, lng: 78.4693 },
  { code: 'UP007', name: 'Auraiya', state: 'Uttar Pradesh', lat: 26.4667, lng: 79.5167 },
  { code: 'UP008', name: 'Ayodhya', state: 'Uttar Pradesh', lat: 26.7923, lng: 82.2043 },
  { code: 'UP009', name: 'Azamgarh', state: 'Uttar Pradesh', lat: 26.0674, lng: 83.1836 },
  { code: 'UP010', name: 'Baghpat', state: 'Uttar Pradesh', lat: 28.9500, lng: 77.2167 },
  { code: 'UP011', name: 'Bahraich', state: 'Uttar Pradesh', lat: 27.5742, lng: 81.5942 },
  { code: 'UP012', name: 'Ballia', state: 'Uttar Pradesh', lat: 25.7613, lng: 84.1471 },
  { code: 'UP013', name: 'Balrampur', state: 'Uttar Pradesh', lat: 27.4294, lng: 82.1833 },
  { code: 'UP014', name: 'Banda', state: 'Uttar Pradesh', lat: 25.4776, lng: 80.3390 },
  { code: 'UP015', name: 'Barabanki', state: 'Uttar Pradesh', lat: 26.9260, lng: 81.1952 },
  { code: 'UP016', name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304 },
  { code: 'UP017', name: 'Basti', state: 'Uttar Pradesh', lat: 26.8000, lng: 82.7167 },
  { code: 'UP018', name: 'Bhadohi', state: 'Uttar Pradesh', lat: 25.4084, lng: 82.5669 },
  { code: 'UP019', name: 'Bijnor', state: 'Uttar Pradesh', lat: 29.3721, lng: 78.1363 },
  { code: 'UP020', name: 'Budaun', state: 'Uttar Pradesh', lat: 28.0381, lng: 79.1264 },
  { code: 'UP021', name: 'Bulandshahr', state: 'Uttar Pradesh', lat: 28.4039, lng: 77.8573 },
  { code: 'UP022', name: 'Chandauli', state: 'Uttar Pradesh', lat: 25.2569, lng: 83.2681 },
  { code: 'UP023', name: 'Chitrakoot', state: 'Uttar Pradesh', lat: 25.2000, lng: 80.9000 },
  { code: 'UP024', name: 'Deoria', state: 'Uttar Pradesh', lat: 26.5047, lng: 83.7872 },
  { code: 'UP025', name: 'Etah', state: 'Uttar Pradesh', lat: 27.5667, lng: 78.6667 },
  { code: 'UP026', name: 'Etawah', state: 'Uttar Pradesh', lat: 26.7769, lng: 79.0239 },
  { code: 'UP027', name: 'Farrukhabad', state: 'Uttar Pradesh', lat: 27.3917, lng: 79.6300 },
  { code: 'UP028', name: 'Fatehpur', state: 'Uttar Pradesh', lat: 25.9304, lng: 80.8000 },
  { code: 'UP029', name: 'Firozabad', state: 'Uttar Pradesh', lat: 27.1500, lng: 78.4000 },
  { code: 'UP030', name: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
  { code: 'UP031', name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
  { code: 'UP032', name: 'Ghazipur', state: 'Uttar Pradesh', lat: 25.5833, lng: 83.5667 },
  { code: 'UP033', name: 'Gonda', state: 'Uttar Pradesh', lat: 27.1333, lng: 81.9500 },
  { code: 'UP034', name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732 },
  { code: 'UP035', name: 'Hamirpur', state: 'Uttar Pradesh', lat: 25.9500, lng: 80.1500 },
  { code: 'UP036', name: 'Hapur', state: 'Uttar Pradesh', lat: 28.7304, lng: 77.7814 },
  { code: 'UP037', name: 'Hardoi', state: 'Uttar Pradesh', lat: 27.4167, lng: 80.1167 },
  { code: 'UP038', name: 'Hathras', state: 'Uttar Pradesh', lat: 27.6000, lng: 78.0500 },
  { code: 'UP039', name: 'Jalaun', state: 'Uttar Pradesh', lat: 26.1500, lng: 79.3500 },
  { code: 'UP040', name: 'Jaunpur', state: 'Uttar Pradesh', lat: 25.7333, lng: 82.6833 },
  { code: 'UP041', name: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4484, lng: 78.5685 },
  { code: 'UP042', name: 'Kannauj', state: 'Uttar Pradesh', lat: 27.0667, lng: 79.9167 },
  { code: 'UP043', name: 'Kanpur Dehat', state: 'Uttar Pradesh', lat: 26.5000, lng: 80.0000 },
  { code: 'UP044', name: 'Kanpur Nagar', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  { code: 'UP045', name: 'Kasganj', state: 'Uttar Pradesh', lat: 27.8167, lng: 78.6500 },
  { code: 'UP046', name: 'Kaushambi', state: 'Uttar Pradesh', lat: 25.3333, lng: 81.3833 },
  { code: 'UP047', name: 'Kheri', state: 'Uttar Pradesh', lat: 27.9167, lng: 80.8000 },
  { code: 'UP048', name: 'Kushinagar', state: 'Uttar Pradesh', lat: 26.7406, lng: 83.8889 },
  { code: 'UP049', name: 'Lalitpur', state: 'Uttar Pradesh', lat: 24.6833, lng: 78.4167 },
  { code: 'UP050', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { code: 'UP051', name: 'Maharajganj', state: 'Uttar Pradesh', lat: 27.1333, lng: 83.5667 },
  { code: 'UP052', name: 'Mahoba', state: 'Uttar Pradesh', lat: 25.2833, lng: 79.8667 },
  { code: 'UP053', name: 'Mainpuri', state: 'Uttar Pradesh', lat: 27.2333, lng: 79.0167 },
  { code: 'UP054', name: 'Mathura', state: 'Uttar Pradesh', lat: 27.4924, lng: 77.6737 },
  { code: 'UP055', name: 'Mau', state: 'Uttar Pradesh', lat: 25.9417, lng: 83.5611 },
  { code: 'UP056', name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064 },
  { code: 'UP057', name: 'Mirzapur', state: 'Uttar Pradesh', lat: 25.1500, lng: 82.5667 },
  { code: 'UP058', name: 'Moradabad', state: 'Uttar Pradesh', lat: 28.8386, lng: 78.7733 },
  { code: 'UP059', name: 'Muzaffarnagar', state: 'Uttar Pradesh', lat: 29.4667, lng: 77.7000 },
  { code: 'UP060', name: 'Pilibhit', state: 'Uttar Pradesh', lat: 28.6333, lng: 79.8000 },
  { code: 'UP061', name: 'Pratapgarh', state: 'Uttar Pradesh', lat: 25.9000, lng: 81.9500 },
  { code: 'UP062', name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
  { code: 'UP063', name: 'Raebareli', state: 'Uttar Pradesh', lat: 26.2309, lng: 81.2332 },
  { code: 'UP064', name: 'Rampur', state: 'Uttar Pradesh', lat: 28.8000, lng: 79.0167 },
  { code: 'UP065', name: 'Saharanpur', state: 'Uttar Pradesh', lat: 29.9667, lng: 77.5500 },
  { code: 'UP066', name: 'Sambhal', state: 'Uttar Pradesh', lat: 28.5833, lng: 78.5500 },
  { code: 'UP067', name: 'Sant Kabir Nagar', state: 'Uttar Pradesh', lat: 26.7667, lng: 83.1833 },
  { code: 'UP068', name: 'Shahjahanpur', state: 'Uttar Pradesh', lat: 27.8833, lng: 79.9167 },
  { code: 'UP069', name: 'Shamli', state: 'Uttar Pradesh', lat: 29.4500, lng: 77.3167 },
  { code: 'UP070', name: 'Shravasti', state: 'Uttar Pradesh', lat: 27.5167, lng: 82.0167 },
  { code: 'UP071', name: 'Siddharthnagar', state: 'Uttar Pradesh', lat: 27.3000, lng: 83.0833 },
  { code: 'UP072', name: 'Sitapur', state: 'Uttar Pradesh', lat: 27.5667, lng: 80.6833 },
  { code: 'UP073', name: 'Sonbhadra', state: 'Uttar Pradesh', lat: 24.6833, lng: 83.0667 },
  { code: 'UP074', name: 'Sultanpur', state: 'Uttar Pradesh', lat: 26.2667, lng: 82.0667 },
  { code: 'UP075', name: 'Unnao', state: 'Uttar Pradesh', lat: 26.5500, lng: 80.4833 },
  { code: 'UP076', name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 }
];

// Generate sample MGNREGA data
const generateSampleData = (districtCode, financialYear, month) => {
  const baseHouseholds = Math.floor(Math.random() * 50000) + 10000;
  const demandRate = 0.3 + Math.random() * 0.4; // 30-70% demand work
  const provisionRate = 0.7 + Math.random() * 0.25; // 70-95% get work
  
  const householdsDemanding = Math.floor(baseHouseholds * demandRate);
  const householdsProvided = Math.floor(householdsDemanding * provisionRate);
  
  const avgPersonDays = 20 + Math.random() * 30; // 20-50 person days per household
  const totalPersonDays = Math.floor(householdsProvided * avgPersonDays);
  
  const scRate = 0.15 + Math.random() * 0.1; // 15-25% SC
  const stRate = 0.05 + Math.random() * 0.1; // 5-15% ST
  const womenRate = 0.3 + Math.random() * 0.2; // 30-50% women
  
  const scPersonDays = Math.floor(totalPersonDays * scRate);
  const stPersonDays = Math.floor(totalPersonDays * stRate);
  const womenPersonDays = Math.floor(totalPersonDays * womenRate);
  
  const totalWorks = Math.floor(Math.random() * 200) + 50;
  const completionRate = 0.4 + Math.random() * 0.4; // 40-80% completion
  const completedWorks = Math.floor(totalWorks * completionRate);
  const ongoingWorks = totalWorks - completedWorks;
  
  const avgWagePerDay = 200 + Math.random() * 50; // ₹200-250 per day
  const wageExpenditure = totalPersonDays * avgWagePerDay;
  const materialExpenditure = wageExpenditure * (0.3 + Math.random() * 0.2); // 30-50% of wages
  const adminExpenditure = (wageExpenditure + materialExpenditure) * 0.05; // 5% admin
  const totalExpenditure = wageExpenditure + materialExpenditure + adminExpenditure;
  
  return {
    district_code: districtCode,
    financial_year: financialYear,
    month: month,
    total_households: baseHouseholds,
    households_demanding_work: householdsDemanding,
    households_provided_work: householdsProvided,
    total_person_days: totalPersonDays,
    sc_person_days: scPersonDays,
    st_person_days: stPersonDays,
    women_person_days: womenPersonDays,
    total_works: totalWorks,
    completed_works: completedWorks,
    ongoing_works: ongoingWorks,
    total_expenditure: Math.round(totalExpenditure),
    wage_expenditure: Math.round(wageExpenditure),
    material_expenditure: Math.round(materialExpenditure),
    admin_expenditure: Math.round(adminExpenditure)
  };
};

const initializeSampleData = async () => {
  try {
    // Insert state
    await runQuery(
      'INSERT OR IGNORE INTO states (state_code, state_name) VALUES (?, ?)',
      ['UP', 'Uttar Pradesh']
    );
    
    // Insert districts
    for (const district of SAMPLE_DISTRICTS) {
      await runQuery(
        'INSERT OR IGNORE INTO districts (district_code, district_name, state_code, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
        [district.code, district.name, 'UP', district.lat, district.lng]
      );
    }
    
    // Generate sample data for last 12 months
    const currentDate = new Date();
    const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
    
    for (const district of SAMPLE_DISTRICTS) {
      for (let i = 0; i < 12; i++) {
        const dataDate = new Date(currentDate);
        dataDate.setMonth(dataDate.getMonth() - i);
        
        const year = dataDate.getFullYear();
        const month = months[dataDate.getMonth()];
        const financialYear = month >= 'April' ? `${year}-${year + 1}` : `${year - 1}-${year}`;
        
        const sampleData = generateSampleData(district.code, financialYear, month);
        
        await runQuery(`
          INSERT OR REPLACE INTO mgnrega_data (
            district_code, financial_year, month, total_households, households_demanding_work,
            households_provided_work, total_person_days, sc_person_days, st_person_days,
            women_person_days, total_works, completed_works, ongoing_works,
            total_expenditure, wage_expenditure, material_expenditure, admin_expenditure
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          sampleData.district_code, sampleData.financial_year, sampleData.month,
          sampleData.total_households, sampleData.households_demanding_work,
          sampleData.households_provided_work, sampleData.total_person_days,
          sampleData.sc_person_days, sampleData.st_person_days, sampleData.women_person_days,
          sampleData.total_works, sampleData.completed_works, sampleData.ongoing_works,
          sampleData.total_expenditure, sampleData.wage_expenditure,
          sampleData.material_expenditure, sampleData.admin_expenditure
        ]);
      }
    }
    
    logger.info('Sample data initialized successfully');
  } catch (error) {
    logger.error('Error initializing sample data:', error);
  }
};

const fetchDataFromAPI = async () => {
  try {
    // This would be the actual API call to data.gov.in
    // For now, we'll use sample data
    logger.info('Fetching data from MGNREGA API...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would:
    // 1. Call the actual API
    // 2. Parse the response
    // 3. Transform the data
    // 4. Store in database
    
    return true;
  } catch (error) {
    logger.error('Error fetching data from API:', error);
    return false;
  }
};

const syncData = async () => {
  try {
    logger.info('Starting data synchronization...');
    
    // Check if we have any data, if not initialize sample data
    const existingData = await getQuery('SELECT COUNT(*) as count FROM mgnrega_data');
    
    if (!existingData || existingData.count === 0) {
      logger.info('No existing data found, initializing sample data...');
      await initializeSampleData();
    }
    
    // Try to fetch from API
    const apiSuccess = await fetchDataFromAPI();
    
    // Update sync status
    await runQuery(
      'INSERT INTO sync_status (last_sync, sync_status, records_updated) VALUES (?, ?, ?)',
      [new Date().toISOString(), apiSuccess ? 'success' : 'fallback', 0]
    );
    
    logger.info('Data synchronization completed');
  } catch (error) {
    logger.error('Error during data synchronization:', error);
    
    // Update sync status with error
    await runQuery(
      'INSERT INTO sync_status (last_sync, sync_status, error_message) VALUES (?, ?, ?)',
      [new Date().toISOString(), 'error', error.message]
    );
  }
};

const startDataSync = () => {
  // Initial sync
  syncData();
  
  // Schedule sync every 6 hours
  cron.schedule('0 */6 * * *', () => {
    logger.info('Running scheduled data sync...');
    syncData();
  });
  
  logger.info('Data synchronization scheduled every 6 hours');
};

module.exports = {
  syncData,
  startDataSync,
  initializeSampleData
};

