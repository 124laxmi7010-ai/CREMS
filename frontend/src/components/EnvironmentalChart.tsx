import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { EnvironmentalParameter } from '../types';
import { useApp } from '../context/AppContext';
import { generateHistoricalReadings } from '../data/mockData';
import {
  Thermometer,
  Droplets,
  Gauge,
  Layers,
  CircleDot,
  Info,
} from 'lucide-react';

interface EnvironmentalChartProps {
  cleanroomId: string;
  initialParameter?: EnvironmentalParameter;
  height?: number;
  showSelector?: boolean;
}

export const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({
  cleanroomId,
  initialParameter = 'temperature',
  height = 300,
  showSelector = true,
}) => {
  const { getCleanroomProfile, readings } = useApp();
  const [selectedParam, setSelectedParam] = useState<EnvironmentalParameter>(initialParameter);
  const [timeRange, setTimeRange] = useState<'6h' | '12h' | '24h'>('24h');

  const profile = getCleanroomProfile(cleanroomId);
  const threshold = profile?.thresholds[selectedParam];

  // Parameter configuration
  const paramConfig: Record<
    EnvironmentalParameter,
    {
      label: string;
      unit: string;
      color: string;
      fillGradient: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    temperature: {
      label: 'Temperature',
      unit: '°C',
      color: '#0284c7', // Sky blue
      fillGradient: '#e0f2fe',
      icon: Thermometer,
    },
    humidity: {
      label: 'Humidity',
      unit: '% RH',
      color: '#0d9488', // Teal
      fillGradient: '#ccfbf1',
      icon: Droplets,
    },
    pressure: {
      label: 'Differential Pressure',
      unit: 'Pa',
      color: '#7c3aed', // Purple/Violet
      fillGradient: '#ede9fe',
      icon: Gauge,
    },
    
    pm25: {
      label: 'PM2.5 Airborne Particles',
      unit: 'µg/m³',
      color: '#e11d48', // Rose
      fillGradient: '#ffe4e6',
      icon: Layers,
    },
    pm10: {
      label: 'PM10 Macro Particles',
      unit: 'µg/m³',
      color: '#be123c', // Crimson
      fillGradient: '#ffe4e6',
      icon: CircleDot,
    },
  };

  const rawData = useMemo(() => {
    return generateHistoricalReadings(cleanroomId, 24);
  }, [cleanroomId]);

  // Adjust data according to timeRange and inject live reading at the tip
  const chartData = useMemo(() => {
    let sliced = rawData;
    if (timeRange === '6h') sliced = rawData.slice(-7);
    else if (timeRange === '12h') sliced = rawData.slice(-13);

    // Make sure latest point reflects live state
    const currentVal = readings[cleanroomId]?.[selectedParam];
    if (currentVal !== undefined && sliced.length > 0) {
      const updated = [...sliced];
      const lastIdx = updated.length - 1;
      updated[lastIdx] = {
        ...updated[lastIdx],
        [selectedParam]: currentVal,
      };
      return updated;
    }
    return sliced;
  }, [rawData, timeRange, readings, cleanroomId, selectedParam]);

  const currentConfig = paramConfig[selectedParam];
  const Icon = currentConfig.icon;

  // Compute sensible Y-axis bounds
  const yDomain = useMemo(() => {
    if (!threshold) return ['auto', 'auto'];
    const minVal = Math.min(...chartData.map((d) => (d as any)[selectedParam]), threshold.min);
    const maxVal = Math.max(...chartData.map((d) => (d as any)[selectedParam]), threshold.max);
    const padding = (maxVal - minVal) * 0.25 || 1;
    return [Math.max(0, Number((minVal - padding).toFixed(1))), Number((maxVal + padding).toFixed(1))];
  }, [chartData, selectedParam, threshold]);

  const currentReading = readings[cleanroomId]?.[selectedParam];

  return (
    <div id={`chart-container-${cleanroomId}`} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${currentConfig.color}15`, color: currentConfig.color }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm">{currentConfig.label} Trend</h3>
              {currentReading !== undefined && (
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Current: {currentReading} {currentConfig.unit}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Acceptable GMP Limit: {threshold?.min ?? 0} to {threshold?.max ?? 0} {currentConfig.unit} (Nominal: {threshold?.nominal ?? 0})
            </p>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto">
          {(['6h', '12h', '24h'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                timeRange === range
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Selector Tabs */}
      {showSelector && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin">
          {(
            [
              'temperature',
              'humidity',
              'pressure',
              'pm25',
              'pm10',
            ] as EnvironmentalParameter[]
          ).map((param) => {
            const pConf = paramConfig[param];
            const PIcon = pConf.icon;
            const isSelected = selectedParam === param;
            const val = readings[cleanroomId]?.[param];

            return (
              <button
                key={param}
                id={`tab-param-${param}`}
                onClick={() => setSelectedParam(param)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <PIcon className="w-3.5 h-3.5" />
                <span>{pConf.label.split(' ')[0]}</span>
                {val !== undefined && (
                  <span
                    className={`font-mono text-[11px] px-1 py-0.2 rounded ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {val}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Chart Graphic */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${selectedParam}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#94a3b8"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              domain={yDomain as any}
              stroke="#94a3b8"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  const isOutOfSpec =
                    threshold && (val < threshold.min || val > threshold.max);

                  return (
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-800 space-y-1">
                      <div className="text-slate-400 font-mono">{label}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                          {val} {currentConfig.unit}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            isOutOfSpec
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {isOutOfSpec ? 'Out of Spec' : 'Validated Spec'}
                        </span>
                      </div>
                      {threshold && (
                        <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                          Spec: {threshold.min} - {threshold.max} {currentConfig.unit}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Threshold Guideline: Upper Limit */}
            {threshold && (
              <ReferenceLine
                y={threshold.max}
                stroke="#e11d48"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Max Limit: ${threshold.max}`,
                  fill: '#be123c',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {/* Threshold Guideline: Lower Limit */}
            {threshold && threshold.min > 0 && (
              <ReferenceLine
                y={threshold.min}
                stroke="#e11d48"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Min Limit: ${threshold.min}`,
                  fill: '#be123c',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
              />
            )}

            {/* Nominal Guideline */}
            {threshold && (
              <ReferenceLine
                y={threshold.nominal}
                stroke="#10b981"
                strokeDasharray="2 2"
                strokeWidth={1}
              />
            )}

            <Area
              type="monotone"
              dataKey={selectedParam}
              stroke={currentConfig.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#grad-${selectedParam})`}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-900 rounded-full" />
            <span>Measured Telemetry</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-600 border-dashed rounded-full" />
            <span>Acceptable GMP Envelope (Min / Max)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-600 rounded-full" />
            <span>Nominal Setpoint</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Info className="w-3.5 h-3.5" />
          <span>Sampling Frequency: 1 Hz / Rolling 1-Hour Averages</span>
        </div>
      </div>
    </div>
  );
};
