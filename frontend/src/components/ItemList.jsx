import React from "react";
import "../styles/ItemList.css";

const ItemList = ({ items, title, itemType }) => {
  if (!items || items.length === 0) {
    return (
      <div className="item-list-container">
        <h2>{title}</h2>
        <p className="no-items">
          No {itemType} detected. Upload an image to get started.
        </p>
      </div>
    );
  }

  // Determine which fields to display based on itemType
  const isGroceryItem = itemType === "items";

  return (
    <div className="item-list-container">
      <h2>{title}</h2>
      <div className="item-list">
        <table>
          <thead>
            <tr>
              {isGroceryItem ? (
                <>
                  <th>Item</th>
                  <th>Quantity</th>
                </>
              ) : (
                <>
                  <th>Produce</th>
                  <th>Freshness</th>
                  <th>Expected Lifespan</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                {isGroceryItem ? (
                  <>
                    <td>
                      {item.itemName ||
                        item.name ||
                        item.item ||
                        "Unknown Item"}
                    </td>
                    <td>{item.count || item.quantity || 1}</td>
                  </>
                ) : (
                  <>
                    <td>
                      {item.produce ||
                        item.itemName ||
                        item.name ||
                        "Unknown Item"}
                    </td>
                    <td className={getFreshnessClass(item.freshness)}>
                      {item.freshness || "Unknown"}
                    </td>
                    <td>
                      {item.expectedLifespan || item.lifespan || "Unknown"}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function to determine freshness class for styling
const getFreshnessClass = (freshness) => {
  if (!freshness) return "";

  const freshnessLower = freshness.toLowerCase();
  if (freshnessLower.includes("excellent") || freshnessLower.includes("good")) {
    return "freshness-good";
  } else if (
    freshnessLower.includes("average") ||
    freshnessLower.includes("fair")
  ) {
    return "freshness-average";
  } else if (
    freshnessLower.includes("poor") ||
    freshnessLower.includes("bad")
  ) {
    return "freshness-poor";
  }

  return "";
};

export default ItemList;
