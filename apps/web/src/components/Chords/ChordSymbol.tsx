import React from 'react';
import './ChordSymbol.scss';

interface ChordSymbolProps {
  name: string;
  color: string;
  active?: boolean;
}

const ChordSymbol: React.FC<ChordSymbolProps> = ({ name, color, active }) => {
  return (
    <div 
      className={`chord-symbol ${active ? 'active' : ''}`} 
      style={{ 
        '--chord-color': color,
        boxShadow: active ? `0 0 15px ${color}` : 'none',
        borderColor: color
      } as React.CSSProperties}
    >
      <span className="chord-name">{name}</span>
    </div>
  );
};

export default ChordSymbol;
