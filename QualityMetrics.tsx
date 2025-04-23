import React from 'react';
import './QualityMetrics.css';

interface QualityMetricsProps {
  repQuality: number;
  formScore: number;
  consistency: number;
  depth: number;
}

const QualityMetrics: React.FC<QualityMetricsProps> = ({
  repQuality,
  formScore,
  consistency,
  depth
}) => {
  return (
    <div className="quality-metrics">
      <div className="metric">
        <div className="metric-label">Rep Quality</div>
        <div className="metric-gauge">
          <div 
            className="metric-fill"
            style={{ width: `${repQuality}%`, backgroundColor: getQualityColor(repQuality) }}
          />
        </div>
        <div className="metric-value">{repQuality}%</div>
      </div>
      
      <div className="metric">
        <div className="metric-label">Form Score</div>
        <div className="metric-gauge">
          <div 
            className="metric-fill"
            style={{ width: `${formScore}%`, backgroundColor: getQualityColor(formScore) }}
          />
        </div>
        <div className="metric-value">{formScore}%</div>
      </div>
      
      <div className="metric">
        <div className="metric-label">Consistency</div>
        <div className="metric-gauge">
          <div 
            className="metric-fill"
            style={{ width: `${consistency}%`, backgroundColor: getQualityColor(consistency) }}
          />
        </div>
        <div className="metric-value">{consistency}%</div>
      </div>
      
      <div className="metric">
        <div className="metric-label">Depth</div>
        <div className="metric-gauge">
          <div 
            className="metric-fill"
            style={{ width: `${depth}%`, backgroundColor: getQualityColor(depth) }}
          />
        </div>
        <div className="metric-value">{depth}%</div>
      </div>
    </div>
  );
};

const getQualityColor = (value: number): string => {
  if (value >= 90) return '#4CAF50';
  if (value >= 70) return '#FFC107';
  return '#FF5252';
};

export default QualityMetrics; 