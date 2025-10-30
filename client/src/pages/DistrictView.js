import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Users, FileText, DollarSign, Calendar, MapPin } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import toast from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DistrictView = () => {
  const { districtCode } = useParams();
  const navigate = useNavigate();
  const [districtData, setDistrictData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12');

  // Fetch district summary data
  const fetchDistrictData = async () => {
    try {
      const response = await fetch(`/api/summary/${districtCode}`);
      const result = await response.json();
      
      if (result.success) {
        setDistrictData(result.data);
      } else {
        toast.error('Failed to load district data');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching district data:', error);
      toast.error('Failed to load district data');
      navigate('/');
    }
  };

  // Fetch trends data
  const fetchTrendsData = async () => {
    try {
      const response = await fetch(`/api/trends/${districtCode}?limit=${selectedPeriod}`);
      const result = await response.json();
      
      if (result.success) {
        setTrendsData(result.data.reverse()); // Reverse to show chronological order
      }
    } catch (error) {
      console.error('Error fetching trends data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchDistrictData(), fetchTrendsData()]);
      setIsLoading(false);
    };

    loadData();
  }, [districtCode, selectedPeriod]);

  // Chart configurations
  const trendsChartData = {
    labels: trendsData.map(d => `${d.month} ${d.financial_year.split('-')[0]}`),
    datasets: [
      {
        label: 'Person Days',
        data: trendsData.map(d => d.total_person_days),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Households Provided Work',
        data: trendsData.map(d => d.households_provided_work),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const expenditureChartData = {
    labels: ['Wage Expenditure', 'Material Expenditure', 'Admin Expenditure'],
    datasets: [
      {
        data: districtData ? [
          districtData.wage_expenditure,
          districtData.material_expenditure,
          districtData.admin_expenditure
        ] : [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 2
      }
    ]
  };

  const participationChartData = {
    labels: ['SC', 'ST', 'Women', 'Others'],
    datasets: [
      {
        data: districtData ? [
          districtData.sc_person_days,
          districtData.st_person_days,
          districtData.women_person_days,
          districtData.total_person_days - districtData.sc_person_days - districtData.st_person_days - districtData.women_person_days
        ] : [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(107, 114, 128)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Trends'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading District Data...</h2>
        <p>Please wait while we fetch the latest information</p>
      </div>
    );
  }

  if (!districtData) {
    return (
      <div className="error-container">
        <h2>District Not Found</h2>
        <p>The requested district data could not be found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="district-view">
      {/* Header */}
      <div className="district-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
          
          <div className="district-info">
            <h1>{districtData.district_name}</h1>
            <p className="district-location">
              <MapPin size={16} />
              {districtData.state_name}
            </p>
            <p className="district-period">
              <Calendar size={16} />
              Latest Data: {districtData.month} {districtData.financial_year}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <section className="metrics-section">
        <div className="container">
          <h2>Key Performance Indicators</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <Users size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{districtData.total_households?.toLocaleString()}</div>
                <div className="metric-label">Total Households</div>
                <div className="metric-description">Registered in the district</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <TrendingUp size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{districtData.work_demand_rate}%</div>
                <div className="metric-label">Work Demand Rate</div>
                <div className="metric-description">Households demanding work</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <FileText size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{districtData.work_provision_rate}%</div>
                <div className="metric-label">Work Provision Rate</div>
                <div className="metric-description">Households provided work</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <DollarSign size={24} />
              </div>
              <div className="metric-content">
                <div className="metric-value">₹{districtData.total_expenditure?.toLocaleString()}</div>
                <div className="metric-label">Total Expenditure</div>
                <div className="metric-description">This month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="container">
          <div className="charts-header">
            <h2>Performance Analysis</h2>
            <div className="period-selector">
              <label>Show last:</label>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
              </select>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Trends Over Time</h3>
              <div className="chart-container">
                <Line data={trendsChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-card">
              <h3>Expenditure Breakdown</h3>
              <div className="chart-container">
                <Doughnut data={expenditureChartData} options={doughnutOptions} />
              </div>
            </div>

            <div className="chart-card">
              <h3>Participation by Category</h3>
              <div className="chart-container">
                <Doughnut data={participationChartData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Stats */}
      <section className="detailed-stats">
        <div className="container">
          <h2>Detailed Statistics</h2>
          <div className="stats-grid">
            <div className="stat-group">
              <h3>Employment Data</h3>
              <div className="stat-item">
                <span className="stat-label">Households Demanding Work:</span>
                <span className="stat-value">{districtData.households_demanding_work?.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Households Provided Work:</span>
                <span className="stat-value">{districtData.households_provided_work?.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Person Days:</span>
                <span className="stat-value">{districtData.total_person_days?.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average Person Days per Household:</span>
                <span className="stat-value">{districtData.avg_person_days}</span>
              </div>
            </div>

            <div className="stat-group">
              <h3>Work Completion</h3>
              <div className="stat-item">
                <span className="stat-label">Total Works:</span>
                <span className="stat-value">{districtData.total_works?.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed Works:</span>
                <span className="stat-value">{districtData.completed_works?.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Ongoing Works:</span>
                <span className="stat-value">{districtData.ongoing_works?.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completion Rate:</span>
                <span className="stat-value">{districtData.work_completion_rate}%</span>
              </div>
            </div>

            <div className="stat-group">
              <h3>Inclusive Participation</h3>
              <div className="stat-item">
                <span className="stat-label">SC Participation:</span>
                <span className="stat-value">{districtData.sc_participation_rate}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">ST Participation:</span>
                <span className="stat-value">{districtData.st_participation_rate}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Women Participation:</span>
                <span className="stat-value">{districtData.women_participation_rate}%</span>
              </div>
            </div>

            <div className="stat-group">
              <h3>Financial Data</h3>
              <div className="stat-item">
                <span className="stat-label">Wage Expenditure:</span>
                <span className="stat-value">₹{districtData.wage_expenditure?.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Material Expenditure:</span>
                <span className="stat-value">₹{districtData.material_expenditure?.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Admin Expenditure:</span>
                <span className="stat-value">₹{districtData.admin_expenditure?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DistrictView;

