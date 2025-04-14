import React from "react";
import {
  Calendar,
  Hash,
  ShoppingBag,
  Calculator,
  Sparkles,
  Badge,
} from "lucide-react";

const ItemsTable = ({ items, darkMode }) => {
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp || "N/A";
    }
  };

  // Get item count color
  const getCountBadgeColor = (count) => {
    if (count >= 5) {
      return darkMode
        ? "bg-purple-900 text-purple-200"
        : "bg-purple-100 text-purple-800";
    } else if (count >= 3) {
      return darkMode
        ? "bg-blue-900 text-blue-200"
        : "bg-blue-100 text-blue-800";
    } else {
      return darkMode
        ? "bg-indigo-900 text-indigo-200"
        : "bg-indigo-100 text-indigo-800";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
      {/* Table header with animated gradient */}
      <div
        className={`py-4 px-6 ${
          darkMode
            ? "bg-gradient-to-r from-blue-900/20 to-indigo-900/20"
            : "bg-gradient-to-r from-blue-50 to-indigo-50"
        }`}
      >
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Grocery Item Analysis
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Detailed inventory of detected grocery items
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
          <thead className={`${darkMode ? "bg-gray-800/80" : "bg-gray-50"}`}>
            <tr>
              <th scope="col" className="px-4 py-3 text-left w-[5%]">
                <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Hash className="h-4 w-4" />
                  <span>ID</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left w-[20%]">
                <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Timestamp</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left w-[60%]">
                <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Item Name</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left w-[15%]">
                <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Calculator className="h-4 w-4" />
                  <span>Count</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-gray-200 dark:divide-gray-700 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-200 ${
                    darkMode ? "hover:bg-gray-700/50" : "hover:bg-blue-50/30"
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                    {formatTimestamp(item.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    <div className="flex items-center">
                      <span className="text-gray-900 dark:text-white">
                        {item.itemName}
                      </span>
                      {item.count > 1 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          x{item.count}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-all ${getCountBadgeColor(
                        item.count
                      )}`}
                    >
                      {item.count}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className={`px-6 py-12 text-center ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                      <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
                      <Badge className="h-6 w-6 absolute bottom-4 right-0 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="font-medium text-lg">No items detected</p>
                    <p className="mt-2 text-sm max-w-md">
                      Capture an image with grocery items to begin your
                      inventory analysis
                    </p>
                    <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-xs text-left max-w-md">
                      <p className="font-medium mb-2 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Pro tip
                      </p>
                      <p>
                        For best results, ensure your grocery items are clearly
                        visible and separated.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {items && items.length > 0 && (
        <div
          className={`p-4 text-xs text-right border-t border-gray-200 dark:border-gray-700 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <p className="text-gray-500 dark:text-gray-400">
            Showing {items.length} item{items.length === 1 ? "" : "s"} with a
            total of {items.reduce((sum, item) => sum + item.count, 0)} units
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemsTable;
