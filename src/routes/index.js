const express = require('express');
const { allQuery, getQuery } = require('../database/db');
const logger = require('../utils/logger');

const setupRoutes = (app) => {
  const router = express.Router();
  
  // Get all states
  router.get('/api/states', async (req, res) => {
    try {
      const states = await allQuery('SELECT * FROM states ORDER BY state_name');
      res.json({ success: true, data: states });
    } catch (error) {
      logger.error('Error fetching states:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch states' });
    }
  });
  
  // Get districts by state
  router.get('/api/districts/:stateCode', async (req, res) => {
    try {
      const { stateCode } = req.params;
      const districts = await allQuery(
        'SELECT * FROM districts WHERE state_code = ? ORDER BY district_name',
        [stateCode]
      );
      res.json({ success: true, data: districts });
    } catch (error) {
      logger.error('Error fetching districts:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch districts' });
    }
  });
  
  // Get all districts (for search functionality)
  router.get('/api/districts', async (req, res) => {
    try {
      const districts = await allQuery(`
        SELECT d.*, s.state_name 
        FROM districts d 
        JOIN states s ON d.state_code = s.state_code 
        ORDER BY d.district_name
      `);
      res.json({ success: true, data: districts });
    } catch (error) {
      logger.error('Error fetching all districts:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch districts' });
    }
  });
  
  // Get MGNREGA performance data for a district
  router.get('/api/performance/:districtCode', async (req, res) => {
    try {
      const { districtCode } = req.params;
      const { year, month } = req.query;
      
      let query = `
        SELECT md.*, d.district_name, s.state_name
        FROM mgnrega_data md
        JOIN districts d ON md.district_code = d.district_code
        JOIN states s ON d.state_code = s.state_code
        WHERE md.district_code = ?
      `;
      const params = [districtCode];
      
      if (year) {
        query += ' AND md.financial_year = ?';
        params.push(year);
      }
      
      if (month) {
        query += ' AND md.month = ?';
        params.push(month);
      }
      
      query += ' ORDER BY md.financial_year DESC, md.month DESC';
      
      const data = await allQuery(query, params);
      
      if (data.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'No data found for this district' 
        });
      }
      
      res.json({ success: true, data });
    } catch (error) {
      logger.error('Error fetching performance data:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch performance data' });
    }
  });
  
  // Get district summary (latest data)
  router.get('/api/summary/:districtCode', async (req, res) => {
    try {
      const { districtCode } = req.params;
      
      const summary = await getQuery(`
        SELECT md.*, d.district_name, s.state_name
        FROM mgnrega_data md
        JOIN districts d ON md.district_code = d.district_code
        JOIN states s ON d.state_code = s.state_code
        WHERE md.district_code = ?
        ORDER BY md.financial_year DESC, md.month DESC
        LIMIT 1
      `, [districtCode]);
      
      if (!summary) {
        return res.status(404).json({ 
          success: false, 
          error: 'No data found for this district' 
        });
      }
      
      // Calculate performance metrics
      const performance = {
        ...summary,
        work_demand_rate: summary.total_households > 0 ? 
          (summary.households_demanding_work / summary.total_households * 100).toFixed(1) : 0,
        work_provision_rate: summary.households_demanding_work > 0 ? 
          (summary.households_provided_work / summary.households_demanding_work * 100).toFixed(1) : 0,
        work_completion_rate: summary.total_works > 0 ? 
          (summary.completed_works / summary.total_works * 100).toFixed(1) : 0,
        avg_person_days: summary.households_provided_work > 0 ? 
          (summary.total_person_days / summary.households_provided_work).toFixed(1) : 0,
        sc_participation_rate: summary.total_person_days > 0 ? 
          (summary.sc_person_days / summary.total_person_days * 100).toFixed(1) : 0,
        st_participation_rate: summary.total_person_days > 0 ? 
          (summary.st_person_days / summary.total_person_days * 100).toFixed(1) : 0,
        women_participation_rate: summary.total_person_days > 0 ? 
          (summary.women_person_days / summary.total_person_days * 100).toFixed(1) : 0
      };
      
      res.json({ success: true, data: performance });
    } catch (error) {
      logger.error('Error fetching district summary:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch district summary' });
    }
  });
  
  // Get historical trends for a district
  router.get('/api/trends/:districtCode', async (req, res) => {
    try {
      const { districtCode } = req.params;
      const { limit = 12 } = req.query;
      
      const trends = await allQuery(`
        SELECT 
          financial_year,
          month,
          total_households,
          households_demanding_work,
          households_provided_work,
          total_person_days,
          sc_person_days,
          st_person_days,
          women_person_days,
          total_works,
          completed_works,
          total_expenditure,
          wage_expenditure
        FROM mgnrega_data
        WHERE district_code = ?
        ORDER BY financial_year DESC, month DESC
        LIMIT ?
      `, [districtCode, parseInt(limit)]);
      
      // Calculate trends
      const trendData = trends.map(record => ({
        ...record,
        work_demand_rate: record.total_households > 0 ? 
          (record.households_demanding_work / record.total_households * 100).toFixed(1) : 0,
        work_provision_rate: record.households_demanding_work > 0 ? 
          (record.households_provided_work / record.households_demanding_work * 100).toFixed(1) : 0,
        work_completion_rate: record.total_works > 0 ? 
          (record.completed_works / record.total_works * 100).toFixed(1) : 0,
        avg_person_days: record.households_provided_work > 0 ? 
          (record.total_person_days / record.households_provided_work).toFixed(1) : 0
      }));
      
      res.json({ success: true, data: trendData });
    } catch (error) {
      logger.error('Error fetching trends:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch trends' });
    }
  });
  
  // Get state-wide comparison
  router.get('/api/state-comparison/:stateCode', async (req, res) => {
    try {
      const { stateCode } = req.params;
      
      const comparison = await allQuery(`
        SELECT 
          d.district_name,
          d.district_code,
          md.total_households,
          md.households_demanding_work,
          md.households_provided_work,
          md.total_person_days,
          md.total_works,
          md.completed_works,
          md.total_expenditure,
          md.financial_year,
          md.month
        FROM mgnrega_data md
        JOIN districts d ON md.district_code = d.district_code
        WHERE d.state_code = ?
        AND md.financial_year = (
          SELECT MAX(financial_year) FROM mgnrega_data WHERE district_code = md.district_code
        )
        AND md.month = (
          SELECT MAX(month) FROM mgnrega_data 
          WHERE district_code = md.district_code 
          AND financial_year = md.financial_year
        )
        ORDER BY md.total_person_days DESC
      `, [stateCode]);
      
      // Calculate performance metrics for comparison
      const comparisonData = comparison.map(record => ({
        ...record,
        work_demand_rate: record.total_households > 0 ? 
          (record.households_demanding_work / record.total_households * 100).toFixed(1) : 0,
        work_provision_rate: record.households_demanding_work > 0 ? 
          (record.households_provided_work / record.households_demanding_work * 100).toFixed(1) : 0,
        work_completion_rate: record.total_works > 0 ? 
          (record.completed_works / record.total_works * 100).toFixed(1) : 0
      }));
      
      res.json({ success: true, data: comparisonData });
    } catch (error) {
      logger.error('Error fetching state comparison:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch state comparison' });
    }
  });
  
  // Get sync status
  router.get('/api/sync-status', async (req, res) => {
    try {
      const status = await getQuery(`
        SELECT * FROM sync_status 
        ORDER BY created_at DESC 
        LIMIT 1
      `);
      
      res.json({ success: true, data: status });
    } catch (error) {
      logger.error('Error fetching sync status:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch sync status' });
    }
  });
  
  // Search districts
  router.get('/api/search', async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || q.length < 2) {
        return res.json({ success: true, data: [] });
      }
      
      const districts = await allQuery(`
        SELECT d.*, s.state_name
        FROM districts d
        JOIN states s ON d.state_code = s.state_code
        WHERE d.district_name LIKE ? OR s.state_name LIKE ?
        ORDER BY d.district_name
        LIMIT 20
      `, [`%${q}%`, `%${q}%`]);
      
      res.json({ success: true, data: districts });
    } catch (error) {
      logger.error('Error searching districts:', error);
      res.status(500).json({ success: false, error: 'Failed to search districts' });
    }
  });
  
  app.use(router);
};

module.exports = { setupRoutes };

