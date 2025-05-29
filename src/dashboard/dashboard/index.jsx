import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faImage,
  faHeart,
  faStar,
  faMoneyBillWave,
  faDownload,
  faArrowTrendUp,
  faArrowTrendDown
} from '@fortawesome/free-solid-svg-icons';
import Chart from 'react-apexcharts';
import './style.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalImages: 0,
    totalLikes: 0,
    totalFavorites: 0,
    totalRatings: 0,
    downloads: 0,
    monthlyTrend: 'up',
    earningsTrend: 'up'
  });

  const [topImages, setTopImages] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with your actual API calls
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setStats({
        totalEarnings: 4280.50,
        totalImages: 147,
        totalLikes: 3256,
        totalFavorites: 892,
        totalRatings: 743,
        downloads: 1284,
        monthlyTrend: 'up',
        earningsTrend: 'up'
      });

      setTopImages([
        {
          id: 1,
          title: "Mountain Sunrise",
          likes: 423,
          favorites: 156,
          rating: 4.8,
          downloads: 87,
          thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        },
        {
          id: 2,
          title: "Ocean Waves",
          likes: 387,
          favorites: 132,
          rating: 4.7,
          downloads: 76,
          thumbnail: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0"
        },
        {
          id: 3,
          title: "Urban Night",
          likes: 298,
          favorites: 98,
          rating: 4.5,
          downloads: 64,
          thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308"
        }
      ]);
    }, 1000);
  }, []);

  const chartOptions = {
    options: {
      chart: {
        id: 'earnings-chart',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: false
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      colors: ['#646cff'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        }
      },
      tooltip: {
        enabled: true,
        theme: 'dark'
      }
    },
    series: [{
      name: 'Earnings',
      data: [120, 190, 300, 350, 280, 400, 320, 500, 410, 480, 520, 600]
    }]
  };

  const radialOptions = {
    options: {
      chart: {
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '60%',
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: '22px',
              color: '#333',
              offsetY: 10,
              formatter: function (val) {
                return val + '%';
              }
            }
          }
        }
      },
      labels: ['Engagement'],
      colors: ['#646cff']
    },
    series: [72]
  };

  return (
    <div className="dashboard-container">
      {/* <div className="dashboard-header">
        <div className="time-filter">
          <select>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
            <option>All time</option>
          </select>
        </div>
      </div> */}

      {/* <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          My Images
        </button>
      </div> */}

      {/* {activeTab === 'overview' && ( */}
        <>
          <div className="stats-grid">
            {/* Earnings Card */}
            <div className="stat-card">
              <div className="stat-icon earnings">
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </div>
              <div className="stat-content">
                <h3>Total Earnings</h3>
                <p className="stat-value">${stats.totalEarnings.toLocaleString()}</p>
                <div className={`stat-trend ${stats.earningsTrend}`}>
                  <FontAwesomeIcon icon={stats.earningsTrend === 'up' ? faArrowTrendUp : faArrowTrendDown} />
                  <span>12.5% from last month</span>
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="stat-card">
              <div className="stat-icon images">
                <FontAwesomeIcon icon={faImage} />
              </div>
              <div className="stat-content">
                <h3>Total Images</h3>
                <p className="stat-value">{stats.totalImages}</p>
                <div className="stat-extra">
                  <span>+8 this month</span>
                </div>
              </div>
            </div>

            {/* Likes Card */}
            <div className="stat-card">
              <div className="stat-icon likes">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <div className="stat-content">
                <h3>Total Likes</h3>
                <p className="stat-value">{stats.totalLikes.toLocaleString()}</p>
                <div className={`stat-trend ${stats.monthlyTrend}`}>
                  <FontAwesomeIcon icon={stats.monthlyTrend === 'up' ? faArrowTrendUp : faArrowTrendDown} />
                  <span>24.3% from last month</span>
                </div>
              </div>
            </div>

            {/* Favorites Card */}
            <div className="stat-card">
              <div className="stat-icon favorites">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <div className="stat-content">
                <h3>Total Favorites</h3>
                <p className="stat-value">{stats.totalFavorites.toLocaleString()}</p>
                <div className="stat-extra">
                  <span>Most favorited: Mountain Sunrise</span>
                </div>
              </div>
            </div>

            {/* Ratings Card */}
            <div className="stat-card">
              <div className="stat-icon ratings">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <div className="stat-content">
                <h3>Total Ratings</h3>
                <p className="stat-value">{stats.totalRatings.toLocaleString()}</p>
                <div className="stat-extra">
                  <span>Avg rating: 4.6/5</span>
                </div>
              </div>
            </div>

            {/* Downloads Card */}
            <div className="stat-card">
              <div className="stat-icon downloads">
                <FontAwesomeIcon icon={faDownload} />
              </div>
              <div className="stat-content">
                <h3>Total Downloads</h3>
                <p className="stat-value">{stats.downloads.toLocaleString()}</p>
                <div className={`stat-trend ${stats.monthlyTrend}`}>
                  <FontAwesomeIcon icon={stats.monthlyTrend === 'up' ? faArrowTrendUp : faArrowTrendDown} />
                  <span>18.7% from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="charts-section">
            <div className="earnings-chart">
              <h3>Monthly Earnings</h3>
              <Chart 
                options={chartOptions.options} 
                series={chartOptions.series} 
                type="area" 
                height="300" 
              />
            </div>
            <div className="engagement-chart">
              <h3>Customer Engagement</h3>
              <Chart 
                options={radialOptions.options} 
                series={radialOptions.series} 
                type="radialBar" 
                height="300" 
              />
            </div>
          </div>

          <div className="top-images-section">
            <h2>Top Performing Images</h2>
            <div className="top-images-grid">
              {topImages.map(image => (
                <div key={image.id} className="image-card">
                  <div className="image-thumbnail" style={{ backgroundImage: `url(${image.thumbnail})` }}></div>
                  <div className="image-details">
                    <h4>{image.title}</h4>
                    <div className="image-stats">
                      <div className="image-stat">
                        <FontAwesomeIcon icon={faHeart} />
                        <span>{image.likes}</span>
                      </div>
                      <div className="image-stat">
                        <FontAwesomeIcon icon={faStar} />
                        <span>{image.rating}</span>
                      </div>
                      <div className="image-stat">
                        <FontAwesomeIcon icon={faDownload} />
                        <span>{image.downloads}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      {/* )} */}

      {/* {activeTab === 'analytics' && (
        <div className="analytics-tab">
          <h2>Detailed Analytics</h2>
          <p>Coming soon - more detailed analytics about your portfolio performance.</p>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="images-tab">
          <h2>Your Image Portfolio</h2>
          <p>Coming soon - manage all your uploaded images.</p>
        </div>
      )} */}
    </div>
  );
}