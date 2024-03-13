import React, { useRef, useState } from "react";
import { Stage, Layer, Line, Circle, Transformer, Image } from "react-konva";

const EditableCanvas = () => {
  const [image, setImage] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [textureImage, setTextureImage] = useState(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const transformerRef = useRef(null);

  const [polygonPoints, setPolygonPoints] = useState([
    { x: 150, y: 50 },
    { x: 200, y: 50 },
    { x: 200, y: 100 },
    { x: 150, y: 130 },
    { x: 70, y: 100 },
    { x: 80, y: 50 },
  ]);
  console.log(polygonPoints);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const newImageObj = new window.Image();
      newImageObj.src = reader.result;
      newImageObj.onload = () => {
        setImageObj(newImageObj);
        setImage(reader.result);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleTextureUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const texture = new window.Image();
      texture.src = reader.result;
      texture.onload = () => {
        setTextureImage(texture);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnd = (e) => {
    const line = e.target;
    const offsetX = line.x();
    const offsetY = line.y();
    const newPoints = polygonPoints.map((point) => ({
      x: point.x + offsetX,
      y: point.y + offsetY,
    }));
    setPolygonPoints(newPoints);

    line.x(0);
    line.y(0);
    transformerRef.current.nodes([]);
    layerRef.current.batchDraw();
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <input type="file" onChange={handleTextureUpload} accept="image/*" />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            transformerRef.current.nodes([]);
            layerRef.current.batchDraw();
          }
        }}
      >
        <Layer ref={layerRef}>
          {imageObj && <Image image={imageObj} />}
          {imageObj && (
            <Line
              points={polygonPoints.flatMap((point) => [point.x, point.y])}
              closed
              fillPatternImage={textureImage}
              fillPatternOffset={{
                x: polygonPoints[4].x,
                y: polygonPoints[4].y,
              }}
              fillPatternScale={{ x: 1, y: 1 }}
              // fillPatternRotation={0}
              // fillPatternX={0}
              // fillPatternY={0}
              fillPatternRepeat="no-repeat"
              stroke={textureImage === null ? "black" : null}
              strokeWidth={2}
              draggable={textureImage === null ? "black" : null}
              // fillPatternClipEnabled // Clip the texture image with the polygon shape
              onDragEnd={handleDragEnd}
            />
          )}
          {imageObj &&
            polygonPoints.map((point, index) => (
              <Circle
                key={index}
                x={point.x}
                y={point.y}
                radius={5}
                fill="blue"
                draggable={textureImage === null ? true : false}
                onDragEnd={(e) => {
                  const newPoints = polygonPoints.slice();

                  newPoints[index] = {
                    x: e.target.x(),
                    y: e.target.y(),
                  };
                  setPolygonPoints(newPoints);
                  layerRef.current.batchDraw();
                }}
              />
            ))}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
};

export default EditableCanvas;
