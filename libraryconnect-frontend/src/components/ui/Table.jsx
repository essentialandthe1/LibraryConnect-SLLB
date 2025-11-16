import React from "react";

const Table = ({ columns = [], data = [], className = "" }) => (
  <div className={`overflow-x-auto w-full ${className}`}>
    <table className="w-full text-sm border-collapse">
      <thead className="bg-blue-600 text-white dark:bg-blue-700 dark:text-white">
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} className="p-2 text-left font-medium">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {data.length > 0 ? (
          data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {row.map((cell, i) => (
                <td key={i} className="p-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="p-4 text-center text-gray-500 dark:text-gray-400">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default Table;
