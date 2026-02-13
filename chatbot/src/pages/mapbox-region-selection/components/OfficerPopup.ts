// Generate popup HTML for an individual field officer marker
export const getOfficerPopupHTML = (properties: Record<string, string>): string => {
  return `
    <div style="
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      min-width: 220px;
      padding: 0;
      color: #e2e8f0;
    ">
      <div style="
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      ">
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #10b981);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
          font-weight: 700;
          flex-shrink: 0;
        ">${(properties.name || 'U')[0]}</div>
        <div>
          <div style="font-weight: 700; font-size: 14px; color: #f1f5f9;">${properties.name || 'Unknown'}</div>
          <div style="font-size: 11px; color: #94a3b8;">Field Officer</div>
        </div>
      </div>
      
      <div style="
        background: rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 12px;
        line-height: 1.8;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="opacity: 0.6;">📍</span>
          <span>${properties.place || '—'}, ${properties.state || '—'}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="opacity: 0.6;">🏷️</span>
          <span>${properties.region || '—'}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="opacity: 0.6;">📞</span>
          <span>${properties.phone || '—'}</span>
        </div>
      </div>
    </div>
  `
}
