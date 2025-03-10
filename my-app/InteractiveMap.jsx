import React, { useState } from 'react';
import { 
    ComposableMap, 
    Geographies, 
    Geography,
    ZoomableGroup
} from 'react-simple-maps';

function InteractiveMap() {
    const [position, setPosition] = useState({ coordinates: [30, -20], zoom: 1 });

    const handleZoomIn = () => {
        setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }));
    };

    const handleZoomOut = () => {
        setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }));
    };

    const handleMoveEnd = (newPosition) => {
        setPosition(newPosition);
    };

    return (
        <div className="relative w-full h-96">
            <ComposableMap 
                projectionConfig={{ scale: 1000 }}
                className="w-full h-full"
            >
                <ZoomableGroup
                    zoom={position.zoom}
                    center={position.coordinates}
                    onMoveEnd={handleMoveEnd}
                >
                    <Geographies geography="/zimbabwe-map.json">
                        {({ geographies }) => 
                            geographies.map(geo => (
                                <Geography 
                                    key={geo.rsmKey} 
                                    geography={geo}
                                    fill="#EAEAEC"
                                    stroke="#D6D6DA"
                                />
                            ))
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
            <div className="absolute top-4 right-4 space-y-2">
                <button 
                    onClick={handleZoomIn}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Zoom In
                </button>
                <button 
                    onClick={handleZoomOut}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Zoom Out
                </button>
            </div>
        </div>
    );
}

export default InteractiveMap;