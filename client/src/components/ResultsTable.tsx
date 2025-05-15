import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { TableData } from '../types/visualization';

interface ResultsTableProps {
  data: TableData;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  const { theme } = useTheme();

  return (
    <div 
      className={`
        rounded-lg overflow-hidden border
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}
    >
      {data.title && (
        <div className={`p-3 font-medium border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          {data.title}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              {data.columns.map((column, index) => (
                <th 
                  key={index}
                  scope="col"
                  className={`
                    px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}
                  `}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {data.rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={rowIndex % 2 === 0 
                  ? (theme === 'dark' ? 'bg-gray-800' : 'bg-white') 
                  : (theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50')
                }
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.note && (
        <div className={`p-3 text-xs italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {data.note}
        </div>
      )}
    </div>
  );
};

export default ResultsTable;