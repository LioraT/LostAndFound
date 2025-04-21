// Common heatmap settings
const baseHeatmapConfig = {
    radius: 35,
    blur: 25,
    maxZoom: 15,
    max: 1.0,
    minOpacity: 0.4,
};

// Color gradients for different types of data
const gradients = {
    lost: {
        0.2: '#ffe5e5',
        0.4: '#ff7f7f',
        0.6: '#ff4c4c',
        0.8: '#ff1919',
        1.0: '#cc0000'
    },
    found: {
        0.2: '#e5ffe5',
        0.4: '#7fbf7f',
        0.6: '#4ca64c',
        0.8: '#198c19',
        1.0: '#006600'
    },

};

// Export configured heatmap settings
export const heatmapConfigs = {
    lost: {
        ...baseHeatmapConfig,
        gradient: gradients.lost
    },
    found: {
        ...baseHeatmapConfig,
        gradient: gradients.found
    
    }
};

// Layer names for the control panel
export const layerNames = {
    lost: "Lost Items Heat",
    found: "Found Items Heat"
};