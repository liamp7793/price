import { useState } from "react";

const pricingData = {
  Double: 197.32,
  King: 236.78,
  "Super King": 275.50,
};

export default function Home() {
  const [selectedBed, setSelectedBed] = useState("Double");
  const [quote, setQuote] = useState(null);

  const generateQuote = () => {
    const baseCost = pricingData[selectedBed];
    const markup = baseCost * 0.2;
    const retailPrice = baseCost + markup;

    setQuote({
      bedSize: selectedBed,
      totalCost: baseCost.toFixed(2),
      retailPrice: retailPrice.toFixed(2),
    });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>JD-35 Standard Beds Quote Generator</h1>
      <label>Select Bed Size:</label>
      <select onChange={(e) => setSelectedBed(e.target.value)} value={selectedBed}>
        {Object.keys(pricingData).map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
      <button onClick={generateQuote} style={{ marginLeft: "10px" }}>Get Quote</button>

      {quote && (
        <div style={{ marginTop: "20px" }}>
          <h2>Quote for {quote.bedSize}</h2>
          <p><strong>Total Cost:</strong> £{quote.totalCost}</p>
          <p><strong>Retail Price (20% markup):</strong> £{quote.retailPrice}</p>
        </div>
      )}
    </div>
  );
}
