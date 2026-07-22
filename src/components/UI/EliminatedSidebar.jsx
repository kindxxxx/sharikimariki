import React from 'react';

export default function EliminatedSidebar({ eliminatedFeed }) {
  return (
    <aside className="eliminated-sidebar">
      <div className="sidebar-header">
        <h2>💀 ВЫБЫЛИ ({eliminatedFeed.length})</h2>
        <p className="sidebar-subtitle">Лента выбывших стран в реальном времени</p>
      </div>

      <div className="sidebar-feed">
        {eliminatedFeed.length === 0 ? (
          <div className="feed-empty">Все страны пока в игре...</div>
        ) : (
          eliminatedFeed.map((item, index) => (
            <div key={`${item.id}-${item.timestamp}-${index}`} className="feed-card animate-slide-in">
              <span className="feed-rank">#{eliminatedFeed.length - index}</span>
              <img src={item.flag} alt={item.name} className="feed-flag" />
              <span className="feed-name">{item.name}</span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
