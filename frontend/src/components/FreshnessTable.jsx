import React, { useState } from "react";
import {
  Calendar,
  Hash,
  Leaf,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Activity,
} from "lucide-react";

const FreshnessTable = ({ freshProduce, darkMode }) => {
  // Keep track of expanded descriptions
  const [expandedRows, setExpandedRows] = useState({});

  // Toggle expanded state for a row
  const toggleRowExpanded = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp || "N/A";
    }
  };

  // Function to determine freshness badge color
  const getFreshnessBadgeColors = (lifespan) => {
    if (!lifespan)
      return darkMode
        ? "bg-gray-700 text-gray-300"
        : "bg-gray-100 text-gray-800";

    const days = parseInt(lifespan.match(/\d+/)?.[0] || "0");

    if (days <= 1) {
      return darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800";
    } else if (days <= 3) {
      return darkMode
        ? "bg-yellow-900 text-yellow-200"
        : "bg-yellow-100 text-yellow-800";
    } else {
      return darkMode
        ? "bg-green-900 text-green-200"
        : "bg-green-100 text-green-800";
    }
  };

  // Get a gradient background for the row based on freshness
  const getRowGradient = (lifespan) => {
    if (!lifespan) return "";

    const days = parseInt(lifespan.match(/\d+/)?.[0] || "0");

    if (days <= 1) {
      return darkMode
        ? "bg-gradient-to-r from-transparent to-red-950/10"
        : "bg-gradient-to-r from-transparent to-red-50";
    } else if (days <= 3) {
      return darkMode
        ? "bg-gradient-to-r from-transparent to-yellow-950/10"
        : "bg-gradient-to-r from-transparent to-yellow-50";
    } else {
      return darkMode
        ? "bg-gradient-to-r from-transparent to-green-950/10"
        : "bg-gradient-to-r from-transparent to-green-50";
    }
  };

  // Get the freshness emoji based on expected lifespan
  const getFreshnessEmoji = (lifespan) => {
    if (!lifespan) return "🔍";

    const days = parseInt(lifespan.match(/\d+/)?.[0] || "0");

    if (days <= 1) {
      return "⚠️";
    } else if (days <= 3) {
      return "⏳";
    } else {
      return "✅";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
      {/* Table header with animated gradient */}
      <div
        className={`py-4 px-6 ${
          darkMode
            ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20"
            : "bg-gradient-to-r from-blue-50 to-purple-50"
        }`}
      >
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Fresh Produce Analysis
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Detailed assessment of produce freshness and expected shelf life
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
              <th scope="col" className="px-4 py-3 text-left w-[15%]">
                <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Timestamp</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left w-[15%]">
                <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Leaf className="h-4 w-4" />
                  <span>Produce</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left w-[50%]">
                <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>Freshness</span>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left w-[15%]">
                <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Expected Lifespan</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-gray-200 dark:divide-gray-700 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {freshProduce && freshProduce.length > 0 ? (
              freshProduce.map((item, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-200 ${
                    darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                  } ${getRowGradient(item.expectedLifespan)}`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                    {formatTimestamp(item.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg" aria-hidden="true">
                        {getFreshnessEmoji(item.expectedLifespan)}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {item.produce}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                    <div>
                      <p
                        className={`${
                          expandedRows[index]
                            ? "whitespace-normal break-words"
                            : "line-clamp-2"
                        }`}
                      >
                        {item.freshness}
                      </p>
                      {item.freshness && item.freshness.length > 60 && (
                        <button
                          onClick={() => toggleRowExpanded(index)}
                          className="mt-2 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
                        >
                          {expandedRows[index] ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              See less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              See more
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-all ${getFreshnessBadgeColors(
                        item.expectedLifespan
                      )}`}
                    >
                      {item.expectedLifespan}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className={`px-6 py-12 text-center ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                      <Leaf className="h-16 w-16 mb-4 opacity-20" />
                      <Activity className="h-6 w-6 absolute bottom-4 right-0 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="font-medium text-lg">
                      No fresh produce detected
                    </p>
                    <p className="mt-2 text-sm max-w-md">
                      Capture an image with fruits or vegetables to begin your
                      freshness analysis
                    </p>
                    <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-xs text-left max-w-md">
                      <p className="font-medium mb-2 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Pro tip
                      </p>
                      <p>
                        For best results, ensure your produce items are clearly
                        visible and well-lit.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {freshProduce && freshProduce.length > 0 && (
        <div
          className={`p-4 text-xs text-right border-t border-gray-200 dark:border-gray-700 ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <p className="text-gray-500 dark:text-gray-400">
            Showing {freshProduce.length} produce{" "}
            {freshProduce.length === 1 ? "item" : "items"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FreshnessTable;
