import React, { useState } from 'react';
import { STATIONS, getAQICategory } from '../data/mockData';
import { MapPin, X } from 'lucide-react';

const MAP_WIDTH = 700;
const MAP_HEIGHT = 480;

const GEO_BOUNDS = {
  minLat: 28.35,
  maxLat: 28.82,
  minLng: 76.95,
  maxLng: 77.45,
};

const latLngToXY = (lat, lng) => {
  const x = ((lng - GEO_BOUNDS.minLng) / (GEO_BOUNDS.maxLng - GEO_BOUNDS.minLng)) * MAP_WIDTH;
  const y = MAP_HEIGHT - ((lat - GEO_BOUNDS.minLat) / (GEO_BOUNDS.maxLat - GEO_BOUNDS.minLat)) * MAP_HEIGHT;
  return { x, y };
};

const StationMarker = ({ station, onClick, isSelected }) => {
  const pos = latLngToXY(station.lat, station.lng);
  const cat = getAQICategory(station.aqi);
  const radius = isSelected ? 14 : 10;

  return (
    <g onClick={() => onClick(station)} style={{ cursor: 'pointer' }}>
      <circle
        cx={pos.x}
        cy={pos.y}
        r={radius + 8}
        fill={cat.color}
        opacity={0.08}
      />
      <circle
        cx={pos.x}
        cy={pos.y}
        r={radius + 4}
        fill={cat.color}
        opacity={0.15}
      />
      <circle
        cx={pos.x}
        cy={pos.y}
        r={radius}
        fill={cat.color}
        stroke={isSelected ? '#fff' : cat.color}
        strokeWidth={isSelected ? 2.5 : 1.5}
        strokeOpacity={0.8}
        opacity={0.9}
      />
      <text
        x={pos.x}
        y={pos.y + 4}
        textAnchor="middle"
        fill="white"
        fontSize={9}
        fontWeight="700"
        fontFamily="JetBrains Mono"
      >
        {station.aqi}
      </text>
      {isSelected && (
        <rect
          x={pos.x + 14}
          y={pos.y - 16}
          width={station.name.length * 6.5}
          height={20}
          rx={4}
          fill="#0f1729"
          stroke={cat.color}
          strokeWidth={1}
          strokeOpacity={0.5}
        />
      )}
      {isSelected && (
        <text
          x={pos.x + 16}
          y={pos.y - 3}
          fill={cat.color}
          fontSize={9}
          fontWeight="600"
          fontFamily="Inter"
        >
          {station.name}
        </text>
      )}
    </g>
  );
};

const StationsMap = () => {
  const [selectedStation, setSelectedStation] = useState(null);

  const aqiDistribution = {
    good: STATIONS.filter(s => s.aqi <= 50).length,
    satisfactory: STATIONS.filter(s => s.aqi > 50 && s.aqi <= 100).length,
    moderate: STATIONS.filter(s => s.aqi > 100 && s.aqi <= 200).length,
    poor: STATIONS.filter(s => s.aqi > 200 && s.aqi <= 300).length,
    veryPoor: STATIONS.filter(s => s.aqi > 300 && s.aqi <= 400).length,
    severe: STATIONS.filter(s => s.aqi > 400).length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
        {[
          { label: 'Good (≤50)', count: aqiDistribution.good, color: '#22c55e' },
          { label: 'Satisfactory', count: aqiDistribution.satisfactory, color: '#84cc16' },
          { label: 'Moderate', count: aqiDistribution.moderate, color: '#eab308' },
          { label: 'Poor', count: aqiDistribution.poor, color: '#f97316' },
          { label: 'Very Poor', count: aqiDistribution.veryPoor, color: '#ef4444' },
          { label: 'Severe (>400)', count: aqiDistribution.severe, color: '#9333ea' },
        ].map(item => (
          <div key={item.label} style={{
            background: '#111827',
            border: `1px solid ${item.count > 0 ? item.color + '33' : '#1e293b'}`,
            borderRadius: '10px',
            padding: '12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: item.count > 0 ? item.color : '#334155', fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
              {item.count}
            </div>
            <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px' }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>

        {/* Map */}
        <div style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>Delhi-NCR Monitoring Stations</div>
              <div style={{ fontSize: '11px', color: '#475569' }}>12 active CPCB monitoring stations — click for details</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="status-dot status-live" />
              <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>All stations online</span>
            </div>
          </div>

          <div style={{ position: 'relative', background: '#0a0f1e', borderRadius: '10px', overflow: 'hidden' }}>
            <svg width="100%" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} style={{ display: 'block' }}>
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#0a0f1e" />
              <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />

              {/* Delhi region approximate outline */}
              <ellipse cx={310} cy={200} rx={160} ry={145} fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

              {/* Zone labels */}
              {[
                { label: 'North', x: 310, y: 70 },
                { label: 'South', x: 310, y: 350 },
                { label: 'East', x: 520, y: 200 },
                { label: 'West', x: 90, y: 200 },
                { label: 'NOIDA', x: 600, y: 160 },
                { label: 'Gurugram', x: 170, y: 390 },
                { label: 'Ghaziabad', x: 590, y: 110 },
                { label: 'Faridabad', x: 420, y: 400 },
              ].map(z => (
                <text key={z.label} x={z.x} y={z.y} textAnchor="middle" fill="#1e2d40" fontSize={9} fontFamily="Inter" fontWeight="500">
                  {z.label}
                </text>
              ))}

              {/* Yamuna river approximate */}
              <path
                d="M 450,50 Q 460,100 445,150 Q 430,200 450,250 Q 470,300 455,360 Q 440,420 460,470"
                fill="none"
                stroke="#1e3a5f"
                strokeWidth="6"
                strokeOpacity={0.5}
              />
              <text x={470} y={260} fill="#1e3a5f" fontSize={8} fontFamily="Inter" transform="rotate(75,470,260)">Yamuna</text>

              {/* Station markers */}
              {STATIONS.map(station => (
                <StationMarker
                  key={station.id}
                  station={station}
                  onClick={setSelectedStation}
                  isSelected={selectedStation?.id === station.id}
                />
              ))}
            </svg>

            {/* Legend */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: '#0f172acc',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}>
              {[
                { color: '#22c55e', label: '≤100' },
                { color: '#eab308', label: '101–200' },
                { color: '#f97316', label: '201–300' },
                { color: '#ef4444', label: '301–400' },
                { color: '#9333ea', label: '401+' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  <span style={{ fontSize: '9px', color: '#64748b' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Selected Station Detail */}
          {selectedStation ? (
            <div style={{
              background: '#111827',
              border: `1px solid ${getAQICategory(selectedStation.aqi).color}33`,
              borderRadius: '12px',
              padding: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{selectedStation.name}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>{selectedStation.zone}</div>
                </div>
                <button
                  onClick={() => setSelectedStation(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* AQI Big Display */}
              <div style={{
                textAlign: 'center',
                padding: '16px',
                borderRadius: '10px',
                background: getAQICategory(selectedStation.aqi).bg + '44',
                marginBottom: '12px',
              }}>
                <div style={{ fontSize: '56px', fontWeight: 900, color: getAQICategory(selectedStation.aqi).color, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
                  {selectedStation.aqi}
                </div>
                <div style={{ fontSize: '13px', color: getAQICategory(selectedStation.aqi).color, fontWeight: 600 }}>
                  {getAQICategory(selectedStation.aqi).label}
                </div>
              </div>

              {/* Pollutants Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  { label: 'PM2.5', value: selectedStation.pm25, unit: 'μg/m³', color: '#3b82f6', limit: 60 },
                  { label: 'PM10', value: selectedStation.pm10, unit: 'μg/m³', color: '#8b5cf6', limit: 100 },
                  { label: 'NO₂', value: selectedStation.no2, unit: 'μg/m³', color: '#f97316', limit: 80 },
                  { label: 'O₃', value: selectedStation.o3, unit: 'μg/m³', color: '#06b6d4', limit: 100 },
                  { label: 'CO', value: selectedStation.co, unit: 'mg/m³', color: '#eab308', limit: 4 },
                  { label: 'SO₂', value: selectedStation.so2, unit: 'μg/m³', color: '#22c55e', limit: 80 },
                ].map(p => (
                  <div key={p.label} style={{ padding: '8px', borderRadius: '7px', background: '#1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{p.label}</span>
                      <span style={{ fontSize: '9px', color: p.value > p.limit ? '#ef4444' : '#22c55e' }}>
                        {p.value > p.limit ? '↑ Over' : '✓ OK'}
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: p.color, fontFamily: 'JetBrains Mono' }}>
                      {p.value}
                    </div>
                    <div style={{ height: '3px', borderRadius: '2px', background: '#334155', overflow: 'hidden', marginTop: '4px' }}>
                      <div style={{
                        width: `${Math.min(100, (p.value / p.limit) * 100)}%`,
                        height: '100%',
                        background: p.value > p.limit ? '#ef4444' : p.color,
                      }} />
                    </div>
                    <div style={{ fontSize: '9px', color: '#334155', marginTop: '2px' }}>Limit: {p.limit} {p.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <MapPin size={28} color="#334155" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '12px', color: '#475569' }}>Click a station on the map</div>
              <div style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>to view detailed readings</div>
            </div>
          )}

          {/* All Stations List */}
          <div style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '14px',
            flex: 1,
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9', marginBottom: '10px' }}>All Stations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '320px', overflowY: 'auto' }}>
              {[...STATIONS].sort((a, b) => b.aqi - a.aqi).map(station => {
                const cat = getAQICategory(station.aqi);
                return (
                  <button
                    key={station.id}
                    onClick={() => setSelectedStation(station)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 8px',
                      borderRadius: '7px',
                      background: selectedStation?.id === station.id ? cat.color + '11' : 'transparent',
                      border: `1px solid ${selectedStation?.id === station.id ? cat.color + '33' : 'transparent'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '11px', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {station.name}
                      </div>
                      <div style={{ fontSize: '9px', color: '#475569' }}>{station.zone}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: cat.color, fontFamily: 'JetBrains Mono' }}>{station.aqi}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationsMap;
