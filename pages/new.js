import React, { useState, useRef, useEffect } from "react";

export default function PriceMultiplierPage() {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState([]);

  // 편집 중인 행 id와 편집값
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingId != null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // 표 셀 기본 스타일 (높이 고정하여 tr 높이 변하지 않도록)
  const cellStyle = {
    padding: 8,
    borderBottom: "1px solid #f0f0f0",
    height: 44, // 고정 높이 (필요시 조정)
    verticalAlign: "middle",
    boxSizing: "border-box",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  const thStyle = {
    borderBottom: "1px solid #ddd",
    textAlign: "left",
    padding: 8,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  // 숫자 입력값 정리: 숫자와 소수점만 허용, 소수점 아래 최대 4자리, 선행 '.'일 경우 '0.'로 변환
  const sanitizeNumericInput = (raw) => {
    if (raw == null) return "";
    let v = String(raw);
    // 허용 문자(숫자와 점)만 남김
    v = v.replace(/[^\d.]/g, "");
    // 점 여러개 제거: 첫 점만 남기고 나머지는 제거
    const parts = v.split(".");
    if (parts.length > 1) {
      const intPart = parts.shift();
      const fracPart = parts.join(""); // 나머지 점 제거된 문자열
      v = intPart + "." + fracPart;
    }
    // 선행 점 처리: ".5" -> "0.5"
    if (v.startsWith(".")) v = "0" + v;
    // 소수점 이하 4자리로 자르기 (있으면)
    if (v.includes(".")) {
      const [intP, fracP] = v.split(".");
      v = intP + "." + fracP.slice(0, 4);
    }
    return v;
  };

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
    // 편집 중인 행을 삭제했을 때 편집 상태 초기화
    if (editingId === id) {
      setEditingId(null);
      setEditValue("");
    }
  };

  // 편집 시작 (클릭)
  const startEdit = (id, display) => {
    setEditingId(id);
    setEditValue(display);
  };

  // 편집 저장 (블러 또는 Enter)
  const saveEdit = (id) => {
    const raw = (editValue ?? "").trim();
    const val = parseFloat(raw);
    // 숫자가 아니면 변경하지 않고 편집 종료
    if (isNaN(val)) {
      setEditingId(null);
      setEditValue("");
      return;
    }
    const newDisplay = padTo4(raw);

    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              original: val,
              originalDisplay: newDisplay,
              x102: roundUp3(val * 1.02),
              x103: roundUp3(val * 1.03),
              x104: roundUp3(val * 1.04),
              x105: roundUp3(val * 1.05),
            }
          : r
      )
    );
    setEditingId(null);
    setEditValue("");
  };

  // 편집 중 취소 (Esc)
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
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
          tableLayout: "fixed", // 중요: 컬럼 너비 고정
        }}
      >
        {/* 고정 컬럼 너비: 첫열 30%, 각 결과 15%씩, 삭제 10% */}
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>

        <thead>
          <tr>
            <th style={thStyle}>입력금액</th>
            <th style={thStyle}>×1.02</th>
            <th style={thStyle}>×1.03</th>
            <th style={thStyle}>×1.04</th>
            <th style={thStyle}>×1.05</th>
            <th style={thStyle}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td
                style={cellStyle}
                onClick={() => startEdit(r.id, r.originalDisplay)}
              >
                {editingId === r.id ? (
                  <input
                    ref={editInputRef}
                    // 숫자+소수점만 허용하고 소수점 이하 최대 4자리로 자름
                    value={editValue}
                    onChange={(e) => setEditValue(sanitizeNumericInput(e.target.value))}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = (e.clipboardData || window.clipboardData).getData("text");
                      setEditValue(sanitizeNumericInput(text));
                    }}
                    onBlur={() => saveEdit(r.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEdit(r.id);
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        cancelEdit();
                      }
                    }}
                    inputMode="decimal"
                    // input이 td 높이에 맞게 유지되도록 설정
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      margin: 0,
                      padding: "2px 6px",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                      lineHeight: "normal",
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      background: "white",
                    }}
                  />
                ) : (
                  r.originalDisplay
                )}
              </td>
              <td style={cellStyle}>{formatUSD(r.x102)}</td>
              <td style={cellStyle}>{formatUSD(r.x103)}</td>
              <td style={cellStyle}>{formatUSD(r.x104)}</td>
              <td style={cellStyle}>{formatUSD(r.x105)}</td>
              <td style={{ ...cellStyle, textAlign: "right" }}>
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
                    height: "24px",
                    boxSizing: "border-box",
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