import React from 'react';

const GreenhouseBTUCalculator = () => {
  const [dimensions, setDimensions] = React.useState({
    length: 20,
    width: 12,
    height: 8,
    doorWidth: 3,
    doorHeight: 6.5
  });

  const [shape, setShape] = React.useState('rectangular');
  const [materials, setMaterials] = React.useState({
    walls: 'twinPoly',
    roof: 'twinPoly',
    doors: 'doubleGlass',
    frame: 'aluminum'
  });
  const [insulation, setInsulation] = React.useState('none');
  const [temperature, setTemperature] = React.useState({
    desired: 75,
    minimum: 30
  });

  const coveringMaterials = {
    singleGlass: { name: "Single Glass", rValue: 0.9 },
    doubleGlass: { name: "Double Glass", rValue: 2.0 },
    twinPoly: { name: "Twin-Wall Polycarbonate", rValue: 1.54 },
    polyFilm: { name: "Polyethylene Film", rValue: 0.83 }
  };

  const frameMaterials = {
    aluminum: { name: "Aluminum", thermalBridge: 0.85 },
    galvanizedSteel: { name: "Galvanized Steel", thermalBridge: 0.80 },
    wood: { name: "Treated Wood", thermalBridge: 0.95 }
  };

  const insulations = {
    none: { 
      name: "None", 
      rValue: 0 
    },
    standardHayBale: { 
      name: "Standard Hay Bale (14\"×18\"×36\")", 
      rValue: 2.5,
      coverage: 4.5
    },
    largeHayBale: { 
      name: "Large Hay Bale (4'×4'×8')", 
      rValue: 2.8,
      coverage: 32
    }
  };

  const calculateArea = () => {
    const { length, width, height, doorWidth, doorHeight } = dimensions;
    const doorArea = doorWidth * doorHeight;
    
    if (shape === 'rectangular') {
      return {
        walls: 2 * (length * height) + 2 * (width * height) - doorArea,
        roof: length * width,
        doors: doorArea
      };
    } else if (shape === 'hoop') {
      const radius = width / 2;
      const archLength = Math.PI * radius;
      return {
        walls: 2 * (width * height) - doorArea,
        roof: length * archLength,
        doors: doorArea
      };
    }
    return { walls: 0, roof: 0, doors: 0 };
  };

  const calculateBTU = () => {
    const area = calculateArea();
    const tempDiff = temperature.desired - temperature.minimum;
    const frameFactor = frameMaterials[materials.frame].thermalBridge;
    
    const wallRValue = coveringMaterials[materials.walls].rValue + insulations[insulation].rValue;
    const roofRValue = coveringMaterials[materials.roof].rValue;
    const doorRValue = coveringMaterials[materials.doors].rValue;
    
    const wallBTU = area.walls * tempDiff * (1/wallRValue);
    const roofBTU = area.roof * tempDiff * (1/roofRValue);
    const doorBTU = area.doors * tempDiff * (1/doorRValue);
    
    const totalBTU = (wallBTU + roofBTU + doorBTU) * (1/frameFactor) * 1.25;
    
    return {
      walls: Math.round(wallBTU),
      roof: Math.round(roofBTU),
      doors: Math.round(doorBTU),
      total: Math.round(totalBTU)
    };
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 text-gray-900">
      <div className="space-y-6 bg-white rounded-lg shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-xl font-bold text-gray-900">Greenhouse BTU Calculator</h2>
        </div>

        <div className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Shape
              </label>
              <select 
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
              >
                <option value="rectangular">Rectangular</option>
                <option value="hoop">Hoop House</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Wall Material
              </label>
              <select 
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={materials.walls}
                onChange={(e) => setMaterials(prev => ({
                  ...prev,
                  walls: e.target.value
                }))}
              >
                {Object.entries(coveringMaterials).map(([key, mat]) => (
                  <option key={key} value={key}>
                    {mat.name} (R-{mat.rValue})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Frame Material
              </label>
              <select 
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={materials.frame}
                onChange={(e) => setMaterials(prev => ({
                  ...prev,
                  frame: e.target.value
                }))}
              >
                {Object.entries(frameMaterials).map(([key, mat]) => (
                  <option key={key} value={key}>{mat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Insulation
              </label>
              <select 
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={insulation}
                onChange={(e) => setInsulation(e.target.value)}
              >
                {Object.entries(insulations).map(([key, ins]) => (
                  <option key={key} value={key}>
                    {ins.name} {ins.rValue > 0 ? `(R-${ins.rValue})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Length (ft)
              </label>
              <input
                type="number"
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={dimensions.length}
                onChange={(e) => setDimensions(prev => ({
                  ...prev,
                  length: Math.max(0, Number(e.target.value))
                }))}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Width (ft)
              </label>
              <input
                type="number"
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={dimensions.width}
                onChange={(e) => setDimensions(prev => ({
                  ...prev,
                  width: Math.max(0, Number(e.target.value))
                }))}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Height (ft)
              </label>
              <input
                type="number"
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={dimensions.height}
                onChange={(e) => setDimensions(prev => ({
                  ...prev,
                  height: Math.max(0, Number(e.target.value))
                }))}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Door Width (ft)
              </label>
              <input
                type="number"
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={dimensions.doorWidth}
                onChange={(e) => setDimensions(prev => ({
                  ...prev,
                  doorWidth: Math.max(0, Number(e.target.value))
                }))}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Door Height (ft)
              </label>
              <input
                type="number"
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={dimensions.doorHeight}
                onChange={(e) => setDimensions(prev => ({
                  ...prev,
                  doorHeight: Math.max(0, Number(e.target.value))
                }))}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Desired Temp (°F)
              </label>
              <input
                type="number"
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={temperature.desired}
                onChange={(e) => setTemperature(prev => ({
                  ...prev,
                  desired: Number(e.target.value)
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Minimum Temp (°F)
              </label>
              <input
                type="number"
                className="w-full border rounded p-2 bg-white text-gray-900"
                value={temperature.minimum}
                onChange={(e) => setTemperature(prev => ({
                  ...prev,
                  minimum: Number(e.target.value)
                }))}
              />
            </div>
          </div>

          <div className="bg-gray-50 border rounded-lg p-6">
            <div className="space-y-3">
              <div className="text-gray-900">
                <span className="font-semibold">Wall Heat Loss:</span>
                {calculateBTU().walls.toLocaleString()} BTU/hr
              </div>
              <div className="text-gray-900">
                <span className="font-semibold">Roof Heat Loss:</span>
                {calculateBTU().roof.toLocaleString()} BTU/hr
              </div>
              <div className="text-gray-900">
                <span className="font-semibold">Door Heat Loss:</span>
                {calculateBTU().doors.toLocaleString()} BTU/hr
              </div>
              <div className="text-lg font-bold text-gray-900 pt-2 border-t">
                Total Required: {calculateBTU().total.toLocaleString()} BTU/hr
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenhouseBTUCalculator;