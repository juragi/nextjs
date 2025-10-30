import React, { useState } from "react";

export default function PriceMultiplierPage() {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState([]);

  // 소수점 3자리에서 올림
  const roundUp3 = (n) => {
    if (isNaN(n)) return NaN;
    return Math.ceil(n * 1000) / 1000;
  };

  // 입력값을 소수점 4자리로 채우되 반올림 없이 부족한 자리만 0 추가
  const padTo4 = (s) => {
    if (s == null) return "0.0000";
    s = String(s).trim();
    if (s === "") return "0.0000";
    const parts = s.split(".");
    const intPartRaw = parts[0];
    const fracRaw = parts[1] ?? "";
    const intPart = intPartRaw === "" ? "0" : intPartRaw;
    if (fracRaw.length >= 4) {
      // 자릿수가 4 이상이면 잘라서 사용 (반올림하지 않음)
      return intPart + "." + fracRaw.slice(0, 4);
    }
    return intPart + "." + fracRaw.padEnd(4, "0");
  };

  const formatUSD = (num, fixed = 2) => {
    if (isNaN(num)) return "-";
    return "$" + Number(num).toFixed(fixed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = input.trim();
    const val = parseFloat(raw);
    if (isNaN(val)) {
      setInput("");
      return;
    }
    const orig = val;
    const origDisplay = padTo4(raw);

    setRows((prev) => {
      const idx = prev.findIndex((r) => Number(r.original) === Number(orig));
      if (idx !== -1) {
        // 이미 존재하면 해당 행을 맨 위로 이동 (중복 생성하지 않음)
        const existing = prev[idx];
        const moved = { ...existing, id: Date.now(), originalDisplay: origDisplay };
        return [moved, ...prev.slice(0, idx), ...prev.slice(idx + 1)];
      } else {
        const entry = {
          original: orig, // 숫자 값 (계산용)
          originalDisplay: origDisplay, // 화면에 표시할 문자열 (소수점 4자리)
          x102: roundUp3(val * 1.02),
          x103: roundUp3(val * 1.03),
          x104: roundUp3(val * 1.04),
          x105: roundUp3(val * 1.05),
          id: Date.now(),
        };
        return [entry, ...prev];
      }
    });

    setInput("");
  };

  // 행 삭제 핸들러
  const handleDelete = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h2>달러 입력 → 1.02, 1.03, 1.04, 1.05 곱한 값 표시 (계산: 소수점 3자리에서 올림)</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="priceInput">금액(달러): </label>
        <input
          id="priceInput"
          type="number"
          step="0.0001" // 소수점 4자리까지 입력 가능
          inputMode="decimal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="예: 100.0000"
          style={{ marginRight: 8 }}
        />
        <button type="submit">추가 (Enter)</button>
      </form>

      <table
        style={{
          marginTop: 20,
          borderCollapse: "collapse",
          width: "100%",
          maxWidth: 800,
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>입력금액</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>×1.02</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>×1.03</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>×1.04</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>×1.05</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{r.originalDisplay}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{formatUSD(r.x102)}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{formatUSD(r.x103)}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{formatUSD(r.x104)}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{formatUSD(r.x105)}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>
                <button
                  onClick={() => handleDelete(r.id)}
                  aria-label={`삭제 ${r.originalDisplay}`}
                  style={{
                    background: "transparent",
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    padding: "2px 6px",
                    cursor: "pointer",
                    color: "#900",
                  }}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}