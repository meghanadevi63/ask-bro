import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { VisualizationData, ChartType } from '../types/visualization';
import Chart from 'chart.js/auto';

interface VisualizationProps {
  data: VisualizationData;
}

const Visualization: React.FC<VisualizationProps> = ({ data }) => {
  const { theme } = useTheme();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<ChartType> | null>(null);

  const getChartColors = () => {
    const isDark = theme === 'dark';
    
    return {
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)', // blue
        'rgba(139, 92, 246, 0.7)',  // purple
        'rgba(16, 185, 129, 0.7)',  // emerald
        'rgba(249, 115, 22, 0.7)',  // orange
        'rgba(236, 72, 153, 0.7)',  // pink
        'rgba(234, 179, 8, 0.7)',   // yellow
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(234, 179, 8, 1)',
      ],
      gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      textColor: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    };
  };

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const colors = getChartColors();
      
      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type: data.type,
        data: {
          labels: data.labels,
          datasets: data.datasets.map((dataset, index) => ({
            ...dataset,
            backgroundColor: Array.isArray(colors.backgroundColor) 
              ? colors.backgroundColor[index % colors.backgroundColor.length] 
              : colors.backgroundColor,
            borderColor: Array.isArray(colors.borderColor) 
              ? colors.borderColor[index % colors.borderColor.length] 
              : colors.borderColor,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: colors.textColor,
              }
            },
            title: {
              display: !!data.title,
              text: data.title || '',
              color: colors.textColor,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              ticks: {
                color: colors.textColor,
              },
              grid: {
                color: colors.gridColor,
              },
            },
            y: {
              ticks: {
                color: colors.textColor,
              },
              grid: {
                color: colors.gridColor,
              },
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, theme]);

  return (
    <div 
      className={`
        p-4 rounded-lg my-4
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'}
      `}
    >
      <h3 className="text-lg font-medium mb-4">{data.title}</h3>
      <div className="h-64 w-full">
        <canvas ref={chartRef} />
      </div>
      {data.description && (
        <p className="mt-3 text-sm text-gray-500">{data.description}</p>
      )}
    </div>
  );
};

export default Visualization;