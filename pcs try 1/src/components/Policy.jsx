import React, { useState } from 'react';
import { GRAP_STAGES, POLICY_RECOMMENDATIONS } from '../data/mockData';
import { CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronUp, Building2, Car, Wheat, Factory, Zap, TrendingUp } from 'lucide-react';

const grapStatusConfig = {
  active: { color: '#22c55e', bg: '#22c55e22', label: 'ACTIVE' },
  standby: { color: '#eab308', bg: '#eab30822', label: 'STANDBY' },
  inactive: { color: '#475569', bg: '#47556922', label: 'INACTIVE' },
};

const priorityConfig = {
  critical: { color: '#ef4444', bg: '#ef444422', label: 'CRITICAL', border: '#ef444444' },
  high: { color: '#f97316', bg: '#f9731622', label: 'HIGH', border: '#f9731644' },
  medium: { color: '#eab308', bg: '#eab30822', label: 'MEDIUM', border: '#eab30844' },
  low: { color: '#22c55e', bg: '#22c55e22', label: 'LOW', border: '#22c55e44' },
};

const statusConfig = {
  active: { color: '#22c55e', label: 'Active', icon: <CheckCircle size={12} color="#22c55e" /> },
  pending: { color: '#f97316', label: 'Pending', icon: <Clock size={12} color="#f97316" /> },
  'in-review': { color: '#3b82f6', label: 'In Review', icon: <AlertTriangle size={12} color="#3b82f6" /> },
  planned: { color: '#64748b', label: 'Planned', icon: <Clock size={12} color="#64748b" /> },
};

const categoryIcons = {
  'Emergency Response': <Zap size={14} color="#ef4444" />,
  'Agriculture': <Wheat size={14} color="#eab308" />,
  'Transport': <Car size={14} color="#3b82f6" />,
  'Industry': <Factory size={14} color="#f97316" />,
  'Long-term': <TrendingUp size={14} color="#8b5cf6" />,
  'Urban Planning': <Building2 size={14} color="#22c55e" />,
};

const GRAPCard = ({ stage, isExpanded, onToggle }) => {
  const stageStatus = grapStatusConfig[stage.status];

  return (
    <div style={{
      background: '#111827',
      border: `1px solid ${stage.status === 'active' ? stage.color + '44' : '#1e293b'}`,
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}>
      {/* Stage Header */}
      <div
        onClick={onToggle}
        style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          background: stage.status === 'active' ? stage.color + '08' : 'transparent',
        }}
      >
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: stage.bgColor,
          border: `2px solid ${stage.color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: stage.color }}>
            {stage.name.replace('Stage ', 'G')}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{stage.name}</span>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: stage.color,
              padding: '1px 6px',
              borderRadius: '4px',
              background: stage.bgColor,
            }}>
              {stage.label}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              color: stageStatus.color,
              padding: '1px 6px',
              borderRadius: '4px',
              background: stageStatus.bg,
            }}>
              {stageStatus.label}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#475569' }}>AQI Range: {stage.aqiRange} • {stage.actions.length} mandated actions</div>
        </div>
        {isExpanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
      </div>

      {/* Expanded Actions */}
      {isExpanded && (
        <div style={{
          padding: '0 16px 14px',
          borderTop: '1px solid #1e293b',
          paddingTop: '12px',
        }}>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em' }}>MANDATED ACTIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {stage.actions.map((action, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: stage.color + '22',
                  border: `1px solid ${stage.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: stage.color }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PolicyCard = ({ policy }) => {
  const pri = priorityConfig[policy.priority];
  const sta = statusConfig[policy.status];
  const categoryIcon = categoryIcons[policy.category];

  return (
    <div style={{
      background: '#111827',
      border: `1px solid ${policy.priority === 'critical' ? '#ef444433' : '#1e293b'}`,
      borderRadius: '12px',
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {categoryIcon}
          <span style={{ fontSize: '11px', color: '#64748b' }}>{policy.category}</span>
          <span style={{ fontSize: '9px', color: '#334155' }}>#{policy.id}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 700,
            color: pri.color,
            padding: '2px 6px',
            borderRadius: '4px',
            background: pri.bg,
            border: `1px solid ${pri.border}`,
            letterSpacing: '0.05em',
          }}>
            {pri.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {sta.icon}
            <span style={{ fontSize: '10px', color: sta.color, fontWeight: 600 }}>{sta.label}</span>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px' }}>
        {policy.title}
      </div>
      <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '10px' }}>
        {policy.description}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
        {[
          { label: 'Impact', value: policy.impact },
          { label: 'Timeline', value: policy.implementationTime },
          { label: 'Est. Reduction', value: policy.estimatedReduction },
        ].map(item => (
          <div key={item.label} style={{ padding: '6px 8px', borderRadius: '6px', background: '#1e293b' }}>
            <div style={{ fontSize: '9px', color: '#475569', marginBottom: '1px' }}>{item.label}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#f1f5f9' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '10px', color: '#475569' }}>Agencies:</span>
        {policy.agencies.map(agency => (
          <span key={agency} style={{
            fontSize: '9px',
            color: '#3b82f6',
            padding: '2px 6px',
            borderRadius: '4px',
            background: '#3b82f622',
            border: '1px solid #3b82f633',
          }}>
            {agency}
          </span>
        ))}
      </div>
    </div>
  );
};

const Policy = () => {
  const [expandedStage, setExpandedStage] = useState(1);
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredPolicies = filterPriority === 'all'
    ? POLICY_RECOMMENDATIONS
    : POLICY_RECOMMENDATIONS.filter(p => p.priority === filterPriority);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* GRAP Status Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #ef444411, #f9731611)',
        border: '1px solid #ef444433',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{
          padding: '8px 16px',
          borderRadius: '8px',
          background: '#ef444422',
          border: '1px solid #ef444444',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span className="status-dot" style={{ background: '#ef4444', animation: 'pulse-glow 2s ease-in-out infinite', boxShadow: '0 0 8px #ef4444' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>GRAP Stage I & II: ACTIVE</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#f1f5f9', fontWeight: 500 }}>
            Graded Response Action Plan activated for Delhi-NCR
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Based on current AQI 334 (Very Poor). Stage I (AQI 201–300) and Stage II (AQI 301–400) measures are mandatory.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {GRAP_STAGES.map(s => (
            <div key={s.stage} style={{
              textAlign: 'center',
              padding: '6px 10px',
              borderRadius: '8px',
              background: s.status === 'active' ? s.color + '22' : '#1e293b',
              border: `1px solid ${s.status === 'active' ? s.color + '44' : '#334155'}`,
            }}>
              <div style={{ fontSize: '9px', color: s.status === 'active' ? s.color : '#475569', fontWeight: 700 }}>{s.name}</div>
              <div style={{ fontSize: '10px', color: grapStatusConfig[s.status].color, fontWeight: 600 }}>
                {grapStatusConfig[s.status].label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* GRAP Stages */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '10px' }}>
            GRAP Stage Details & Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {GRAP_STAGES.map(stage => (
              <GRAPCard
                key={stage.stage}
                stage={stage}
                isExpanded={expandedStage === stage.stage}
                onToggle={() => setExpandedStage(expandedStage === stage.stage ? null : stage.stage)}
              />
            ))}
          </div>
        </div>

        {/* Policy Recommendations */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>
              AI Policy Recommendations
            </div>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#94a3b8',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '720px', overflowY: 'auto' }}>
            {filteredPolicies.map(policy => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        </div>
      </div>

      {/* Implementation Timeline */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>
          Policy Implementation Timeline
        </div>
        <div style={{ position: 'relative', paddingLeft: '24px' }}>
          <div style={{
            position: 'absolute',
            left: '8px',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(180deg, #3b82f6, #1e293b)',
          }} />
          {[
            { time: 'Immediate', label: 'GRAP Stage II Activated', color: '#ef4444', desc: 'Construction ban, diesel generator restriction, anti-smog guns deployed' },
            { time: '24 hours', label: 'Crop Fire Enforcement', color: '#f97316', desc: 'Field inspections in Punjab & Haryana, notices issued to violators' },
            { time: '48 hours', label: 'Odd-Even Scheme Launch', color: '#eab308', desc: 'Vehicle rationing on major arterial roads in Delhi' },
            { time: '72 hours', label: 'Industrial Audit Complete', color: '#3b82f6', desc: 'SO2 emission compliance review at 24 industrial units' },
            { time: '6 months', label: 'EV Fleet Expansion', color: '#8b5cf6', desc: 'Phase 1: 500 electric buses on high-frequency DTC routes' },
            { time: '12 months', label: 'Green Buffer Zones', color: '#22c55e', desc: '10,000 native trees planted along industrial corridors' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '14px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-20px',
                top: '4px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: item.color,
                border: '2px solid #0f1729',
                boxShadow: `0 0 8px ${item.color}88`,
              }} />
              <div style={{ flexShrink: 0, width: '80px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: item.color,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: item.color + '22',
                }}>
                  {item.time}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Policy;
