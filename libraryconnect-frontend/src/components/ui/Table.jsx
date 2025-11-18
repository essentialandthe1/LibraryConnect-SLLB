import React from "react";
import { cn } from "@/lib/utils";

export function Table({ columns = [], data = [] }) {
  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b">
            {columns.map((col, index) => (
              <th
                key={index}
                className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={columns.length}>
                No data found
              </td>
            </tr>
          )}

          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b transition-colors hover:bg-muted/50"
            >
              {row.map((cell, c) => (
                <td key={c} className="p-2 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
