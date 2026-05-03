import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { TrendingUp, TrendingDown, Wind, Thermometer, Droplets, Eye } from 'lucide-react';
import { STATIONS, FORECAST_DATA, HISTORICAL_DATA, WEATHER_DATA, getAQICategory, AI_INSIGHTS } from '../data/mockData';

const MetricCard = ({ label, value, unit, color, subtext, trend, trendUp }) => (
  <div className="card-hover" style={{
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '16px',
    flex: 1,
    minWidth: '130px',
  }}>
    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', letterSpacing: '0.05em' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
      <span style={{ fontSize: '28px', fontWeight: 800, color, fontFamily: 'JetBrains Mono' }}>{value}</span>
      <span style={{ fontSize: '12px', color: '#475569' }}>{unit}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '11px', color: '#475569' }}>{subtext}</span>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {trendUp ? <TrendingUp size={10} color="#ef4444" /> : <TrendingDown size={10} color="#22c55e" />}
          <span style={{ fontSize: '10px', color: trendUp ? '#ef4444' : '#22c55e', fontWeight: 600 }}>{trend}</span>
        </div>
      )}
    </div>
  </div>
);

const StationRow = ({ station }) => {
  const cat = getAQICategory(station.aqi);
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #1e293b22',
      gap: '8px',
    }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12px', color: '#f1f5f9', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {station.name}
        </div>
        <div style={{ fontSize: '10px', color: '#475569' }}>{station.zone}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: cat.color, fontFamily: 'JetBrains Mono' }}>{station.aqi}</div>
        <div style={{ fontSize: '9px', color: cat.color, fontWeight: 600 }}>{cat.label}</div>
      </div>
      <div style={{ width: '60px', flexShrink: 0 }}>
        <div style={{ height: '4px', borderRadius: '2px', background: '#1e293b', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, (station.aqi / 500) * 100)}%`,
            height: '100%',
            background: cat.color,
            borderRadius: '2px',
          }} />
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ fontSize: '12px', color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Overview = () => {
  const avgAQI = Math.round(STATIONS.reduce((s, st) => s + st.aqi, 0) / STATIONS.length);
  const avgPM25 = Math.round(STATIONS.reduce((s, st) => s + st.pm25, 0) / STATIONS.length);
  const avgPM10 = Math.round(STATIONS.reduce((s, st) => s + st.pm10, 0) / STATIONS.length);
  const avgNO2 = Math.round(STATIONS.reduce((s, st) => s + st.no2, 0) / STATIONS.length);
  const sortedStations = [...STATIONS].sort((a, b) => b.aqi - a.aqi);
  const recentForecast = FORECAST_DATA.slice(0, 25);
  const cat = getAQICategory(avgAQI);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Top Metrics Row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <MetricCard label="NCR AVG AQI" value={avgAQI} unit="" color={cat.color} subtext={cat.label} trend="+12%" trendUp />
        <MetricCard label="PM2.5" value={avgPM25} unit="μg/m³" color="#3b82f6" subtext="NAAQS: 60" trend="+8%" trendUp />
        <MetricCard label="PM10" value={avgPM10} unit="μg/m³" color="#8b5cf6" subtext="NAAQS: 100" trend="+5%" trendUp />
        <MetricCard label="NO₂" value={avgNO2} unit="μg/m³" color="#f97316" subtext="NAAQS: 80" trend="+3%" trendUp />
        <MetricCard label="ACTIVE ALERTS" value={6} unit="" color="#ef4444" subtext="2 critical" trend="" />
        <MetricCard label="WIND SPEED" value={WEATHER_DATA.windSpeed} unit="km/h" color="#06b6d4" subtext={`${WEATHER_DATA.windDirection} direction`} trendUp={false} />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '16px' }}>

        {/* AQI Trend Chart */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>24-Hour AQI Trend</div>
              <div style={{ fontSize: '11px', color: '#475569' }}>Today's pollution pattern</div>
            </div>
            <div style={{ fontSize: '11px', color: '#3b82f6', padding: '3px 8px', borderRadius: '6px', background: '#3b82f622' }}>
              Next 24h forecast
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={recentForecast}>
              <defs>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={cat.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={cat.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} interval={3} />
              <YAxis domain={[150, 480]} tick={{ fontSize: 9, fill: '#475569' }} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={400} stroke="#9333ea" strokeDasharray="3 3" strokeOpacity={0.5} label={{ value: 'Severe', fill: '#9333ea', fontSize: 9 }} />
              <ReferenceLine y={300} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} label={{ value: 'Very Poor', fill: '#ef4444', fontSize: 9 }} />
              <Area type="monotone" dataKey="aqi" stroke={cat.color} strokeWidth={2} fill="url(#aqiGrad)" name="AQI" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Trend */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>30-Day Pollutant History</div>
              <div style={{ fontSize: '11px', color: '#475569' }}>PM2.5 & PM10 trend</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={HISTORICAL_DATA}>
              <defs>
                <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pm10Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#475569' }} interval={4} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="pm25" stroke="#3b82f6" strokeWidth={1.5} fill="url(#pm25Grad)" name="PM2.5" />
              <Area type="monotone" dataKey="pm10" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#pm10Grad)" name="PM10" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Station Ranking */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Station Rankings</div>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '12px' }}>Sorted by AQI (highest first)</div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {sortedStations.map(station => (
              <StationRow key={station.id} station={station} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Weather Panel */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '12px' }}>Meteorological Conditions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
            {[
              { icon: <Thermometer size={16} color="#f97316" />, label: 'Temp', value: `${WEATHER_DATA.temperature}°C` },
              { icon: <Droplets size={16} color="#3b82f6" />, label: 'Humidity', value: `${WEATHER_DATA.humidity}%` },
              { icon: <Wind size={16} color="#06b6d4" />, label: 'Wind', value: `${WEATHER_DATA.windSpeed} km/h` },
              { icon: <Eye size={16} color="#8b5cf6" />, label: 'Visibility', value: `${WEATHER_DATA.visibility} km` },
            ].map(item => (
              <div key={item.label} style={{
                padding: '10px',
                borderRadius: '8px',
                background: '#1e293b',
                textAlign: 'center',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{item.value}</div>
                <div style={{ fontSize: '10px', color: '#475569' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {WEATHER_DATA.forecast.map(day => (
              <div key={day.day} style={{
                flex: 1,
                textAlign: 'center',
                padding: '8px 4px',
                borderRadius: '8px',
                background: '#1e293b',
              }}>
                <div style={{ fontSize: '9px', color: '#475569', marginBottom: '4px' }}>{day.day}</div>
                <div style={{ fontSize: '16px', marginBottom: '2px' }}>
                  {day.condition === 'Clear' ? '☀️' : day.condition === 'Partly Cloudy' ? '⛅' : '🌫️'}
                </div>
                <div style={{ fontSize: '11px', color: '#f97316', fontWeight: 600 }}>{day.high}°</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>{day.low}°</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #3b82f622, #06b6d422)',
              border: '1px solid #3b82f644',
              fontSize: '11px',
              fontWeight: 700,
              color: '#3b82f6',
            }}>AI INSIGHTS</div>
            <span style={{ fontSize: '11px', color: '#475569' }}>3 new insights</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {AI_INSIGHTS.map(insight => (
              <div key={insight.id} style={{
                padding: '10px',
                borderRadius: '8px',
                background: '#1e293b',
                border: '1px solid #243044',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 600 }}>{insight.model}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '40px', height: '3px', borderRadius: '2px', background: '#334155', overflow: 'hidden' }}>
                      <div style={{ width: `${insight.confidence}%`, height: '100%', background: '#22c55e' }} />
                    </div>
                    <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600 }}>{insight.confidence}%</span>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '4px' }}>{insight.insight}</div>
                <div style={{ fontSize: '10px', color: '#f59e0b' }}>→ {insight.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
