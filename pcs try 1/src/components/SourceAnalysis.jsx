import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { POLLUTION_SOURCES, SOURCE_HEATMAP_DATA, STATIONS } from '../data/mockData';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>{d.name}</div>
        <div style={{ fontSize: '12px', color: payload[0].fill }}>Contribution: {d.value}%</div>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{d.description}</div>
        <div style={{
          fontSize: '11px',
          color: d.trend?.startsWith('+') ? '#ef4444' : '#22c55e',
          marginTop: '2px',
          fontWeight: 600,
        }}>
          Trend: {d.trend}
        </div>
      </div>
    );
  }
  return null;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const radarData = [
  { subject: 'Vehicles', A: 32, fullMark: 50 },
  { subject: 'Industry', A: 24, fullMark: 50 },
  { subject: 'Crop Fire', A: 18, fullMark: 50 },
  { subject: 'Dust', A: 12, fullMark: 50 },
  { subject: 'Biomass', A: 8, fullMark: 50 },
  { subject: 'Aerosols', A: 4, fullMark: 50 },
];

const SourceAnalysis = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  const stationNames = Object.keys(SOURCE_HEATMAP_DATA[0]).filter(k => k !== 'source');

  const heatmapColorScale = (value) => {
    if (value >= 35) return { bg: '#ef444433', text: '#ef4444', border: '#ef444444' };
    if (value >= 25) return { bg: '#f9731633', text: '#f97316', border: '#f9731644' };
    if (value >= 15) return { bg: '#eab30833', text: '#eab308', border: '#eab30844' };
    return { bg: '#22c55e22', text: '#22c55e', border: '#22c55e33' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Dominant Source', value: 'Vehicle Exhaust', sub: '32% contribution', color: '#3b82f6' },
          { label: 'AI Confidence', value: '94%', sub: 'Source Attribution Model v3.2', color: '#22c55e' },
          { label: 'Data Points', value: '2,847', sub: 'Last 24 hours analyzed', color: '#8b5cf6' },
          { label: 'Fire Hotspots', value: '847', sub: 'Punjab & Haryana regions', color: '#ef4444' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{card.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: card.color, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>

        {/* Pie Chart */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Source Distribution</div>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '12px' }}>AI-attributed PM2.5 sources</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={POLLUTION_SOURCES}
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={40}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                onClick={(data) => setSelectedSource(data)}
              >
                {POLLUTION_SOURCES.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke={selectedSource?.name === entry.name ? '#fff' : 'transparent'} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
            {POLLUTION_SOURCES.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }} />
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>{s.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Source Intensity Radar</div>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '12px' }}>Multi-dimensional source profile</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
              <PolarRadiusAxis domain={[0, 50]} tick={false} axisLine={false} />
              <Radar name="Contribution %" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Source Details List */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Source Breakdown</div>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '12px' }}>With trend analysis</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {POLLUTION_SOURCES.map(source => (
              <div key={source.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: source.color }} />
                    <span style={{ fontSize: '11px', color: '#f1f5f9' }}>{source.name}</span>
                  </div>
                  <div style={{ display: 'flex', items: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: source.trend.startsWith('+') ? '#ef4444' : source.trend === '0%' ? '#64748b' : '#22c55e',
                    }}>
                      {source.trend}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: source.color, fontFamily: 'JetBrains Mono' }}>
                      {source.value}%
                    </span>
                  </div>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: '#1e293b', overflow: 'hidden' }}>
                  <div style={{
                    width: `${source.value * 2.5}%`,
                    height: '100%',
                    background: source.color,
                    borderRadius: '3px',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source-Station Heatmap */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>
          Source-Station Contribution Heatmap (%)
        </div>
        <div style={{ fontSize: '11px', color: '#475569', marginBottom: '16px' }}>
          AI-attributed contribution of each source at key monitoring stations
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>
                  Pollution Source
                </th>
                {stationNames.map(stn => (
                  <th key={stn} style={{ padding: '8px 12px', textAlign: 'center', fontSize: '11px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>
                    {stn}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SOURCE_HEATMAP_DATA.map((row, i) => (
                <tr key={row.source} style={{ background: i % 2 === 0 ? 'transparent' : '#0f172a22' }}>
                  <td style={{ padding: '8px 12px', fontSize: '12px', color: '#f1f5f9', fontWeight: 500 }}>
                    {row.source}
                  </td>
                  {stationNames.map(stn => {
                    const val = row[stn];
                    const style = heatmapColorScale(val);
                    return (
                      <td key={stn} style={{ padding: '6px 12px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          background: style.bg,
                          border: `1px solid ${style.border}`,
                          fontSize: '12px',
                          fontWeight: 700,
                          color: style.text,
                          fontFamily: 'JetBrains Mono',
                        }}>
                          {val}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
          {[
            { label: '< 15% Low', color: '#22c55e' },
            { label: '15–25% Moderate', color: '#eab308' },
            { label: '25–35% High', color: '#f97316' },
            { label: '> 35% Critical', color: '#ef4444' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color + '44', border: `1px solid ${item.color}55` }} />
              <span style={{ fontSize: '10px', color: '#64748b' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Station-wise Bar Chart */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Station-wise Pollutant Comparison</div>
        <div style={{ fontSize: '11px', color: '#475569', marginBottom: '12px' }}>PM2.5, PM10 & NO₂ across all stations</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={STATIONS} margin={{ left: 0, right: 10, top: 5, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#475569' }} angle={-35} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 9, fill: '#475569' }} width={35} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            <Bar dataKey="pm25" fill="#3b82f6" name="PM2.5" radius={[3, 3, 0, 0]} />
            <Bar dataKey="pm10" fill="#8b5cf6" name="PM10" radius={[3, 3, 0, 0]} />
            <Bar dataKey="no2" fill="#f97316" name="NO₂" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SourceAnalysis;
