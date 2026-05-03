import React, { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine
} from 'recharts';
import { HISTORICAL_DATA } from '../data/mockData';
import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', fontWeight: 600 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '2px' }}>
            <span style={{ fontSize: '11px', color: p.color }}>{p.name}:</span>
            <span style={{ fontSize: '11px', color: '#f1f5f9', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>
              {p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ label, value, unit, change, color, isUp }) => (
  <div style={{
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '14px 16px',
  }}>
    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
      <span style={{ fontSize: '26px', fontWeight: 800, color, fontFamily: 'JetBrains Mono' }}>{value}</span>
      <span style={{ fontSize: '11px', color: '#475569' }}>{unit}</span>
    </div>
    {change && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        {isUp ? <TrendingUp size={11} color="#ef4444" /> : <TrendingDown size={11} color="#22c55e" />}
        <span style={{ fontSize: '10px', color: isUp ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
          {change} vs last month
        </span>
      </div>
    )}
  </div>
);

const HistoricalData = () => {
  const [activeMetric, setActiveMetric] = useState('aqi');
  const [chartType, setChartType] = useState('area');

  const avgAQI = Math.round(HISTORICAL_DATA.reduce((s, d) => s + d.aqi, 0) / HISTORICAL_DATA.length);
  const maxAQI = Math.max(...HISTORICAL_DATA.map(d => d.aqi));
  const minAQI = Math.min(...HISTORICAL_DATA.map(d => d.aqi));
  const avgPM25 = Math.round(HISTORICAL_DATA.reduce((s, d) => s + d.pm25, 0) / HISTORICAL_DATA.length);

  const metricConfig = {
    aqi: { color: '#ef4444', label: 'AQI', unit: '' },
    pm25: { color: '#3b82f6', label: 'PM2.5', unit: 'μg/m³' },
    pm10: { color: '#8b5cf6', label: 'PM10', unit: 'μg/m³' },
    no2: { color: '#f97316', label: 'NO₂', unit: 'μg/m³' },
    so2: { color: '#22c55e', label: 'SO₂', unit: 'μg/m³' },
    o3: { color: '#06b6d4', label: 'O₃', unit: 'μg/m³' },
  };

  const monthlyComparison = [
    { month: 'Jun', aqi: 98, pm25: 42, pm10: 78 },
    { month: 'Jul', aqi: 82, pm25: 35, pm10: 61 },
    { month: 'Aug', aqi: 91, pm25: 39, pm10: 72 },
    { month: 'Sep', aqi: 124, pm25: 58, pm10: 96 },
    { month: 'Oct', aqi: 234, pm25: 112, pm10: 187 },
    { month: 'Nov', aqi: 334, pm25: 168, pm10: 271 },
  ];

  const weekdayData = [
    { day: 'Mon', aqi: 312 },
    { day: 'Tue', aqi: 298 },
    { day: 'Wed', aqi: 334 },
    { day: 'Thu', aqi: 356 },
    { day: 'Fri', aqi: 378 },
    { day: 'Sat', aqi: 287 },
    { day: 'Sun', aqi: 256 },
  ];

  const currentMetric = metricConfig[activeMetric];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <StatCard label="30-Day Avg AQI" value={avgAQI} unit="" color="#ef4444" change="+18%" isUp />
        <StatCard label="Peak AQI (30d)" value={maxAQI} unit="" color="#9333ea" change="+24%" isUp />
        <StatCard label="Best AQI (30d)" value={minAQI} unit="" color="#22c55e" change="-8%" isUp={false} />
        <StatCard label="Avg PM2.5 (30d)" value={avgPM25} unit="μg/m³" color="#3b82f6" change="+15%" isUp />
      </div>

      {/* Main Historical Chart */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>30-Day Historical Trend</div>
            <div style={{ fontSize: '11px', color: '#475569' }}>Daily average values across all NCR stations</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Metric Selector */}
            <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '3px', borderRadius: '8px' }}>
              {Object.entries(metricConfig).map(([key, conf]) => (
                <button
                  key={key}
                  onClick={() => setActiveMetric(key)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: activeMetric === key ? conf.color : 'transparent',
                    border: 'none',
                    color: activeMetric === key ? 'white' : '#64748b',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>
            {/* Chart Type */}
            <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '3px', borderRadius: '8px' }}>
              {['area', 'bar', 'line'].map(type => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: chartType === type ? '#334155' : 'transparent',
                    border: 'none',
                    color: chartType === type ? '#f1f5f9' : '#64748b',
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          {chartType === 'bar' ? (
            <BarChart data={HISTORICAL_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#475569' }} interval={3} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} width={38} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={activeMetric} fill={currentMetric.color} name={currentMetric.label} radius={[3, 3, 0, 0]} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={HISTORICAL_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#475569' }} interval={3} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} width={38} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey={activeMetric} stroke={currentMetric.color} strokeWidth={2} dot={false} name={currentMetric.label} />
            </LineChart>
          ) : (
            <AreaChart data={HISTORICAL_DATA}>
              <defs>
                <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#475569' }} interval={3} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} width={38} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey={activeMetric} stroke={currentMetric.color} strokeWidth={2} fill="url(#histGrad)" name={currentMetric.label} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Two-column Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Monthly Comparison */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Monthly AQI Comparison (2024)</div>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '12px' }}>Seasonal pollution pattern — winter peak evident</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={300} stroke="#ef444466" strokeDasharray="3 3" label={{ value: 'Very Poor', fill: '#ef4444', fontSize: 9 }} />
              <ReferenceLine y={200} stroke="#f9731666" strokeDasharray="3 3" label={{ value: 'Poor', fill: '#f97316', fontSize: 9 }} />
              <Bar dataKey="aqi" name="AQI" radius={[4, 4, 0, 0]}>
                {monthlyComparison.map((entry, index) => (
                  <Cell key={index} fill={entry.aqi > 300 ? '#ef4444' : entry.aqi > 200 ? '#f97316' : entry.aqi > 100 ? '#eab308' : '#22c55e'} />
                ))}
              </Bar>
              <Bar dataKey="pm25" fill="#3b82f6" name="PM2.5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekday Pattern */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Weekday AQI Pattern</div>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '12px' }}>Higher weekday pollution due to traffic & industry</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekdayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis domain={[200, 400]} tick={{ fontSize: 9, fill: '#475569' }} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="aqi" name="AQI" radius={[4, 4, 0, 0]} fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-pollutant Trend */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Multi-Pollutant Historical Comparison</div>
        <div style={{ fontSize: '11px', color: '#475569', marginBottom: '12px' }}>All key pollutants over last 30 days</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={HISTORICAL_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#475569' }} interval={3} />
            <YAxis tick={{ fontSize: 9, fill: '#475569' }} width={35} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            <Line type="monotone" dataKey="pm25" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="PM2.5" />
            <Line type="monotone" dataKey="pm10" stroke="#8b5cf6" strokeWidth={1.5} dot={false} name="PM10" />
            <Line type="monotone" dataKey="no2" stroke="#f97316" strokeWidth={1.5} dot={false} name="NO₂" />
            <Line type="monotone" dataKey="so2" stroke="#22c55e" strokeWidth={1.5} dot={false} name="SO₂" />
            <Line type="monotone" dataKey="o3" stroke="#06b6d4" strokeWidth={1.5} dot={false} name="O₃" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>Raw Data Table — Last 30 Days</div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '6px',
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#94a3b8',
            fontSize: '11px',
            cursor: 'pointer',
          }}>
            <Download size={12} />
            Export CSV
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr>
                {['Date', 'AQI', 'PM2.5', 'PM10', 'NO₂', 'SO₂', 'O₃'].map(col => (
                  <th key={col} style={{
                    padding: '8px 12px',
                    textAlign: col === 'Date' ? 'left' : 'center',
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: 600,
                    borderBottom: '1px solid #1e293b',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...HISTORICAL_DATA].reverse().slice(0, 15).map((row, i) => {
                const colors = { aqi: '#ef4444', pm25: '#3b82f6', pm10: '#8b5cf6', no2: '#f97316', so2: '#22c55e', o3: '#06b6d4' };
                return (
                  <tr key={row.date} style={{ background: i % 2 === 0 ? 'transparent' : '#0f172a22' }}>
                    <td style={{ padding: '7px 12px', fontSize: '12px', color: '#f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={10} color="#475569" />
                        {row.date}
                      </div>
                    </td>
                    {[
                      { val: row.aqi, color: colors.aqi },
                      { val: row.pm25, color: colors.pm25 },
                      { val: row.pm10, color: colors.pm10 },
                      { val: row.no2, color: colors.no2 },
                      { val: row.so2, color: colors.so2 },
                      { val: row.o3, color: colors.o3 },
                    ].map((cell, j) => (
                      <td key={j} style={{ padding: '7px 12px', textAlign: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: cell.color, fontFamily: 'JetBrains Mono' }}>
                          {cell.val}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;
