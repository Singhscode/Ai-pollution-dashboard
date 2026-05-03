import React, { useState } from 'react';
import {
  Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Bar
} from 'recharts';
import { FORECAST_DATA, getAQICategory } from '../data/mockData';
import { Brain, TrendingUp, CheckCircle } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    const cat = d ? getAQICategory(d.aqi) : null;
    return (
      <div className="custom-tooltip" style={{ minWidth: '180px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px' }}>{label}</div>
        {d && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>AQI:</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: cat?.color }}>{d.aqi} ({cat?.label})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>PM2.5:</span>
              <span style={{ fontSize: '11px', color: '#3b82f6' }}>{d.pm25} μg/m³</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>PM10:</span>
              <span style={{ fontSize: '11px', color: '#8b5cf6' }}>{d.pm10} μg/m³</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Temp / Humidity:</span>
              <span style={{ fontSize: '11px', color: '#f97316' }}>{d.temp}°C / {d.humidity}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Confidence:</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#22c55e' }}>{d.confidence}%</span>
            </div>
          </>
        )}
      </div>
    );
  }
  return null;
};

const Forecast = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

  const periodMap = { '24h': 24, '48h': 48, '72h': 72 };
  const displayData = FORECAST_DATA.slice(0, periodMap[selectedPeriod] + 1);

  const maxAQI = Math.max(...displayData.map(d => d.aqi));
  const minAQI = Math.min(...displayData.map(d => d.aqi));
  const avgAQI = Math.round(displayData.reduce((s, d) => s + d.aqi, 0) / displayData.length);
  const peakEntry = displayData.find(d => d.aqi === maxAQI);
  const cat = getAQICategory(avgAQI);

  const confidenceZones = [
    { start: 0, end: 24, confidence: 92, label: '24h' },
    { start: 24, end: 48, confidence: 78, label: '48h' },
    { start: 48, end: 72, confidence: 61, label: '72h' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {[
          { label: 'Forecast Model', value: 'LSTM v2.4', sub: 'Trained on 5-year data', color: '#3b82f6', icon: <Brain size={14} color="#3b82f6" /> },
          { label: 'Peak AQI Expected', value: maxAQI, sub: peakEntry?.time + ' ' + peakEntry?.day, color: getAQICategory(maxAQI).color, icon: <TrendingUp size={14} color={getAQICategory(maxAQI).color} /> },
          { label: 'Minimum AQI', value: minAQI, sub: 'Early morning dip', color: getAQICategory(minAQI).color, icon: <CheckCircle size={14} color={getAQICategory(minAQI).color} /> },
          { label: 'Avg Forecast AQI', value: avgAQI, sub: cat.label, color: cat.color, icon: <TrendingUp size={14} color={cat.color} /> },
          { label: 'Model Confidence', value: '89%', sub: 'Next 24h window', color: '#22c55e', icon: <CheckCircle size={14} color="#22c55e" /> },
        ].map(card => (
          <div key={card.label} style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              {card.icon}
              <span style={{ fontSize: '10px', color: '#64748b' }}>{card.label}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: card.color, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Period Selector & Main Chart */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>AQI Forecast — {selectedPeriod} Window</div>
            <div style={{ fontSize: '11px', color: '#475569' }}>LSTM Neural Network predictions with confidence bands</div>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['24h', '48h', '72h'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  background: selectedPeriod === p ? '#3b82f6' : '#1e293b',
                  border: `1px solid ${selectedPeriod === p ? '#3b82f6' : '#334155'}`,
                  color: selectedPeriod === p ? 'white' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="aqiForecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="pm25ForecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: '#475569' }}
              interval={selectedPeriod === '72h' ? 5 : selectedPeriod === '48h' ? 3 : 1}
            />
            <YAxis domain={[100, 500]} tick={{ fontSize: 9, fill: '#475569' }} width={38} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={displayData[24]?.time} stroke="#334155" strokeDasharray="4 4"
              label={{ value: '24h', fill: '#475569', fontSize: 9 }} />
            {selectedPeriod !== '24h' && (
              <ReferenceLine x={displayData[48]?.time} stroke="#334155" strokeDasharray="4 4"
                label={{ value: '48h', fill: '#475569', fontSize: 9 }} />
            )}
            <ReferenceLine y={400} stroke="#9333ea88" strokeDasharray="3 3" label={{ value: 'Severe', fill: '#9333ea', fontSize: 9 }} />
            <ReferenceLine y={300} stroke="#ef444488" strokeDasharray="3 3" label={{ value: 'Very Poor', fill: '#ef4444', fontSize: 9 }} />
            <ReferenceLine y={200} stroke="#f9731688" strokeDasharray="3 3" label={{ value: 'Poor', fill: '#f97316', fontSize: 9 }} />
            <Area type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={2.5} fill="url(#aqiForecastGrad)" name="AQI" dot={false} />
            <Area type="monotone" dataKey="pm25" stroke="#06b6d4" strokeWidth={1.5} fill="url(#pm25ForecastGrad)" name="PM2.5" dot={false} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence + Weather Correlation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Confidence Bands */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Forecast Confidence by Window</div>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '16px' }}>Model accuracy decreases with forecast horizon</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {confidenceZones.map(zone => (
              <div key={zone.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#f1f5f9', fontWeight: 600 }}>
                      {zone.label} Window
                    </span>
                    <span style={{ fontSize: '11px', color: '#475569', marginLeft: '8px' }}>
                      (Hours {zone.start}–{zone.end})
                    </span>
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: zone.confidence >= 85 ? '#22c55e' : zone.confidence >= 70 ? '#eab308' : '#f97316',
                    fontFamily: 'JetBrains Mono',
                  }}>
                    {zone.confidence}%
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: '#1e293b', overflow: 'hidden' }}>
                  <div style={{
                    width: `${zone.confidence}%`,
                    height: '100%',
                    background: zone.confidence >= 85 ? '#22c55e' : zone.confidence >= 70 ? '#eab308' : '#f97316',
                    borderRadius: '4px',
                    transition: 'width 1s ease',
                  }} />
                </div>
                <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px' }}>
                  {zone.confidence >= 85 ? '✓ High confidence — reliable for action planning' :
                    zone.confidence >= 70 ? '⚠ Moderate confidence — use with caution' :
                      '⚡ Lower confidence — indicative only'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Correlation */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Weather-Pollution Correlation (Next 24h)</div>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '12px' }}>Temperature, humidity & wind speed vs AQI</div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={FORECAST_DATA.slice(0, 25)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} interval={3} />
              <YAxis yAxisId="left" domain={[0, 50]} tick={{ fontSize: 9, fill: '#475569' }} width={30} />
              <YAxis yAxisId="right" orientation="right" domain={[100, 500]} tick={{ fontSize: 9, fill: '#475569' }} width={40} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }} />
              <Bar yAxisId="left" dataKey="humidity" fill="#3b82f644" name="Humidity %" radius={[2, 2, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={1.5} name="Temp °C" dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="windSpeed" stroke="#06b6d4" strokeWidth={1.5} name="Wind km/h" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="aqi" stroke="#ef4444" strokeWidth={2} name="AQI" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {[
              { color: '#f97316', label: 'Temperature (°C)', shape: 'line' },
              { color: '#06b6d4', label: 'Wind Speed (km/h)', shape: 'line' },
              { color: '#3b82f644', label: 'Humidity (%)', shape: 'bar' },
              { color: '#ef4444', label: 'AQI (right axis)', shape: 'line' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '16px', height: '3px', background: item.color, borderRadius: '1px' }} />
                <span style={{ fontSize: '9px', color: '#64748b' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Breakdown Table */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '12px' }}>Hourly Forecast Detail — Next 24 Hours</div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '6px', minWidth: '900px' }}>
            {FORECAST_DATA.slice(0, 25).map((d, i) => {
              const c = getAQICategory(d.aqi);
              return (
                <div key={i} style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '8px 4px',
                  borderRadius: '8px',
                  background: c.bg + '44',
                  border: `1px solid ${c.color}22`,
                  minWidth: '50px',
                }}>
                  <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '2px' }}>
                    {i === 0 ? 'NOW' : d.time}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: c.color, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
                    {d.aqi}
                  </div>
                  <div style={{ fontSize: '8px', color: '#475569', marginTop: '2px' }}>{c.label}</div>
                  <div style={{ marginTop: '4px', height: '3px', borderRadius: '2px', background: '#1e293b', overflow: 'hidden' }}>
                    <div style={{ width: `${(d.aqi / 500) * 100}%`, height: '100%', background: c.color }} />
                  </div>
                  <div style={{ fontSize: '8px', color: '#3b82f6', marginTop: '3px' }}>PM:{d.pm25}</div>
                  <div style={{ fontSize: '8px', color: '#f97316', marginTop: '1px' }}>{d.temp}°C</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
