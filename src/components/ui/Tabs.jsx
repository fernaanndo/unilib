import './Tabs.css';

export default function Tabs({
  tabs = [],
  activeTab,
  onTabChange,
  className = '',
}) {
  return (
    <div className={`tabs ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <button
            key={tab.key}
            className={`tabs__tab ${isActive ? 'tabs__tab--active' : ''}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.key)}
          >
            <span className="tabs__tab-label">{tab.label}</span>
            {tab.count != null && (
              <span className="tabs__tab-count">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
