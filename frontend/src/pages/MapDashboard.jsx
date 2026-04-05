import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchNearbyShips } from '../services/api';

const MUMBAI_PORT = [19.0760, 72.8777];

// Custom ship marker component
function ShipMarker({ ship, onClick }) {
  const getMarkerColor = (riskLevel) => {
    const level = riskLevel?.toUpperCase();
    switch (level) {
      case 'RED':
      case 'HIGH':
        return { fill: '#EF4444', glow: 'ship-marker-high' };
      case 'AMBER':
      case 'MEDIUM':
        return { fill: '#F59E0B', glow: 'ship-marker-medium' };
      case 'GREEN':
      case 'LOW':
        return { fill: '#10B981', glow: 'ship-marker-low' };
      default:
        return { fill: '#6B7280', glow: '' };
    }
  };

  const colors = getMarkerColor(ship.risk_level);

  return (
    <CircleMarker
      center={[ship.lat, ship.lon]}
      radius={10}
      fillColor={colors.fill}
      color="#000000"
      weight={2}
      opacity={1}
      fillOpacity={0.8}
      eventHandlers={{
        click: () => onClick(ship),
      }}
    >
      <Popup>
        <div className="text-sm">
          <div className="font-semibold mb-1 text-white">{ship.name}</div>
          <div className="text-gray-400 text-xs">MMSI: {ship.mmsi}</div>
          <div className="text-gray-400 text-xs">Speed: {ship.speed?.toFixed(1) || 0} knots</div>
          <div className="text-gray-400 text-xs">Heading: {ship.heading || 0}°</div>
        </div>
      </Popup>
    </CircleMarker>
  );
}

// Ship list panel component
function ShipListPanel({ ships, selectedShip, onSelectShip, filter, onFilterChange, isLoading, error }) {
  const filters = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

  const getRiskBadgeClass = (level) => {
    const normalizedLevel = level?.toUpperCase();
    switch (normalizedLevel) {
      case 'RED':
      case 'HIGH':
        return 'risk-high';
      case 'AMBER':
      case 'MEDIUM':
        return 'risk-medium';
      case 'GREEN':
      case 'LOW':
        return 'risk-low';
      default:
        return 'border border-border-primary text-text-muted';
    }
  };

  const getFilteredShips = () => {
    if (filter === 'ALL') return ships;
    return ships.filter(s => {
      const level = s.risk_level?.toUpperCase();
      return level === filter ||
             (filter === 'HIGH' && level === 'RED') ||
             (filter === 'MEDIUM' && level === 'AMBER') ||
             (filter === 'LOW' && level === 'GREEN');
    });
  };

  const filteredShips = getFilteredShips();

  return (
    <div className="w-80 bg-bg-panel border-r border-border-primary flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border-primary">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Vessel Tracking</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-alert-amber animate-pulse' : error ? 'bg-alert-red' : 'bg-alert-green'}`}></div>
            <span className="text-xs text-text-muted">{ships.length} vessels</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                  : 'bg-bg-card text-text-muted border border-border-primary hover:border-border-secondary'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Ship List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-text-muted">Loading vessels...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <svg className="w-10 h-10 text-alert-red mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-alert-red mb-1">Connection Error</p>
              <p className="text-xs text-text-muted">{error}</p>
            </div>
          </div>
        ) : filteredShips.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-text-muted">No vessels detected in this area.</span>
          </div>
        ) : (
          <ul className="divide-y divide-border-primary">
            {filteredShips.map((ship) => (
              <li
                key={ship.mmsi || ship.id}
                onClick={() => onSelectShip(ship)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedShip?.mmsi === ship.mmsi
                    ? 'bg-accent-primary/10 border-l-2 border-accent-primary'
                    : 'hover:bg-bg-cardAlt border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-white">{ship.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${getRiskBadgeClass(ship.risk_level)}`}>
                    {ship.risk_level || 'LOW'}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-text-muted">
                  <div className="flex justify-between">
                    <span>MMSI</span>
                    <span className="font-mono text-text-secondary">{ship.mmsi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed</span>
                    <span className="font-mono text-text-secondary">{ship.speed?.toFixed(1) || 0} kn</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heading</span>
                    <span className="font-mono text-text-secondary">{ship.heading || 0}°</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-border-primary">
        <div className="text-[10px] uppercase text-text-muted tracking-wider mb-3">Risk Legend</div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-alert-red shadow-glow"></div>
            <span className="text-xs text-text-muted">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-alert-amber shadow-glow"></div>
            <span className="text-xs text-text-muted">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-alert-green shadow-glow"></div>
            <span className="text-xs text-text-muted">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ship info panel component
function ShipInfoPanel({ ship, onClose, onInspect }) {
  if (!ship) return null;

  return (
    <div className="w-96 bg-bg-panel border-l border-border-primary flex flex-col h-full slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border-primary flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Vessel Intelligence</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-bg-cardAlt rounded transition-colors"
        >
          <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Ship Name & Risk */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{ship.name}</h3>
          <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider risk-${ship.risk_level?.toLowerCase() || 'low'}`}>
            {ship.risk_level || 'LOW'}
          </span>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-card border border-border-primary rounded p-3">
            <div className="text-[10px] uppercase text-text-muted tracking-wider mb-1">MMSI</div>
            <div className="text-sm font-mono text-white">{ship.mmsi || 'N/A'}</div>
          </div>
          <div className="bg-bg-card border border-border-primary rounded p-3">
            <div className="text-[10px] uppercase text-text-muted tracking-wider mb-1">Flag</div>
            <div className="text-sm text-white">{ship.flag || 'Unknown'}</div>
          </div>
          <div className="bg-bg-card border border-border-primary rounded p-3">
            <div className="text-[10px] uppercase text-text-muted tracking-wider mb-1">Type</div>
            <div className="text-sm text-white">{ship.type || 'Cargo'}</div>
          </div>
          <div className="bg-bg-card border border-border-primary rounded p-3">
            <div className="text-[10px] uppercase text-text-muted tracking-wider mb-1">Status</div>
            <div className="text-sm text-white">{ship.status || 'Underway'}</div>
          </div>
        </div>

        {/* Navigation Data */}
        <div>
          <div className="text-[10px] uppercase text-text-muted tracking-wider mb-3">Navigation Data</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-border-primary">
              <span className="text-xs text-text-muted">Speed</span>
              <span className="text-sm font-mono text-white">{ship.speed?.toFixed(2) || 0} knots</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-primary">
              <span className="text-xs text-text-muted">Heading</span>
              <span className="text-sm font-mono text-white">{ship.heading || 0}°</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-primary">
              <span className="text-xs text-text-muted">Course</span>
              <span className="text-sm font-mono text-white">{ship.course || ship.heading || 0}°</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-primary">
              <span className="text-xs text-text-muted">Destination</span>
              <span className="text-sm text-white">{ship.destination || 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-text-muted">ETA</span>
              <span className="text-sm font-mono text-white">{ship.eta || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Position */}
        <div>
          <div className="text-[10px] uppercase text-text-muted tracking-wider mb-3">Current Position</div>
          <div className="bg-bg-card border border-border-primary rounded p-3 font-mono text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-text-muted">Latitude</span>
              <span className="text-white">{ship.lat?.toFixed(6) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Longitude</span>
              <span className="text-white">{ship.lon?.toFixed(6) || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border-primary">
          <button
            onClick={() => onInspect(ship)}
            className="w-full py-2.5 bg-accent-primary hover:bg-accent-dark text-white text-sm font-medium rounded border border-accent-dark/50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Initiate Inspection
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MapDashboard() {
  const [ships, setShips] = useState([]);
  const [selectedShip, setSelectedShip] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoadedOnce = useRef(false);

  const loadShips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch ships near Mumbai Port from backend
      const data = await fetchNearbyShips(MUMBAI_PORT[0], MUMBAI_PORT[1], 50);
      const shipsArray = Array.isArray(data) ? data : [];
      setShips(shipsArray);
      hasLoadedOnce.current = true;
    } catch (err) {
      console.error('Failed to load ships:', err);
      // Only show error on first load, not on retries
      if (!hasLoadedOnce.current) {
        const errorMsg = err.code === 'ERR_NETWORK'
          ? 'Unable to connect to the server. Please ensure the backend is running.'
          : err.message || 'Failed to load vessel data';
        setError(errorMsg);
      }
      setShips([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShips();
    
    // Auto-refresh ships every 30 seconds
    const interval = setInterval(loadShips, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectShip = (ship) => {
    setSelectedShip(ship);
  };

  const handleCloseShipPanel = () => {
    setSelectedShip(null);
  };

  const handleInspect = (ship) => {
    console.log('Initiating inspection for:', ship);
  };

  return (
    <div className="flex h-full">
      {/* Ship List Panel */}
      <ShipListPanel
        ships={ships}
        selectedShip={selectedShip}
        onSelectShip={handleSelectShip}
        filter={filter}
        onFilterChange={setFilter}
        isLoading={isLoading}
        error={error}
      />

      {/* Map Area */}
      <div className="flex-1 relative">
        <MapContainer
          center={MUMBAI_PORT}
          zoom={9}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ background: '#000000' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains={['a', 'b', 'c', 'd']}
          />

          {ships.map((ship) => (
            <ShipMarker
              key={ship.mmsi || ship.id}
              ship={ship}
              onClick={handleSelectShip}
            />
          ))}
        </MapContainer>

        {/* Map Overlay - Top Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="bg-bg-panel/90 backdrop-blur border border-border-primary rounded px-4 py-2 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-alert-amber animate-pulse' : error ? 'bg-alert-red' : 'bg-alert-green'} animate-pulse`}></div>
                <span className="text-xs text-text-secondary">{isLoading ? 'Loading...' : error ? 'Offline' : 'Live Tracking'}</span>
              </div>
              <span className="text-xs text-text-muted">|</span>
              <span className="text-xs text-text-muted font-mono">Mumbai Port Authority</span>
            </div>
          </div>

          <div className="bg-bg-panel/90 backdrop-blur border border-border-primary rounded px-4 py-2 pointer-events-auto">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              <span className="text-xs text-text-secondary">50 km radius</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="absolute bottom-4 left-4 bg-risk-danger/90 backdrop-blur border border-alert-red rounded px-4 py-3 max-w-md">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-alert-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-alert-red">Connection Warning</div>
                <div className="text-xs text-gray-400 mt-1">{error}</div>
                <button 
                  onClick={loadShips}
                  className="text-xs text-accent-primary hover:underline mt-1"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ship Info Panel */}
      {selectedShip && (
        <ShipInfoPanel
          ship={selectedShip}
          onClose={handleCloseShipPanel}
          onInspect={handleInspect}
        />
      )}
    </div>
  );
}
