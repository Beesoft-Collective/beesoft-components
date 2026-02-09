import Konva from 'konva';
import { Circle, Group, Image as KonvaImage, Layer, Line, Path, Rect, Stage } from "react-konva";
import { AvatarEditorProps } from "./avatar-editor.props.ts";
import { ChangeEvent, useEffect, useId, useRef, useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { fileToBase64 } from "@beesoft/common";
import Vector2d = Konva.Vector2d;

const AvatarEditor = ({
  width,
  height,
  label = 'Click to Choose a File',
  source,
  showPreviewOnFileLoad = true,
  cropRadius = 30,
  cropColor = 'white',
  closeColor = 'white',
  shadingColor = 'grey',
  shadingOpacity = 0.4,
  onEdit,
  onRemove
}: AvatarEditorProps) => {
  const [imageWidth, setImageWidth] = useState<number>(width || height || 0);
  const [imageHeight, setImageHeight] = useState<number>(height || width || 0)
  const [defaultDimensions, setDefaultDimensions] = useState(0);
  const [imageScale, setImageScale] = useState<number>(1);
  const [imageCropRadius, setImageCropRadius] = useState(cropRadius);
  const [showFileLoader, setShowFileLoader] = useState(true);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement>();

  const lastSource = useRef<string>(undefined);
  const lastMouseY = useRef(0);
  const halfImageWidth = useRef(0);
  const halfImageHeight = useRef(0);
  const lastFillPatternOffset = useRef<Vector2d>(undefined);
  const stageRef = useRef<Konva.Stage>(null);
  const cropRef = useRef<Konva.Circle>(null);
  const cropStrokeRef = useRef<Konva.Circle>(null);
  const resizeRef = useRef<Konva.Rect>(null);
  const resizeIconRef = useRef<Konva.Path>(null);

  const fileLoaderId = useId();

  useEffect(() => {
    if (!width && !height) {
      throw new Error('Either width or height must be set to a value greater than zero.');
    } else if (width && height) {
      throw new Error('Both width and height cannot be set together, set one or the other.');
    }

    if (height) {
      setDefaultDimensions(height);
    } else {
      // @ts-expect-error width in this case would not be undefined
      setDefaultDimensions(width);
    }
  }, [width, height]);

  useEffect(() => {
    if (source && source !== lastSource.current) {
      loadImage(source);
    }
  }, [source]);

  const loadImage = (imageData: string) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      processImage(image);
    };

    image.src = imageData;
    lastSource.current = imageData;
  };

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const result = await fileToBase64(event.target.files[0]);
      if (result) {
        loadImage(result);
      }
    }
  };

  const onRemoveFile = () => {
    setLoadedImage(undefined);
    setShowFileLoader(true);
    setImageCropRadius(cropRadius);
    setImageScale(1);
    onRemove?.();
    onEdit?.();
  };

  const processImage = (image: HTMLImageElement) => {
    const originalImageWidth = image.width;
    const originalImageHeight = image.height;
    const imageRatio = originalImageHeight / originalImageWidth;

    let finalHeight: number
    let finalWidth: number;

    if (height && !width) {
      finalHeight = height || originalImageHeight;
      finalWidth = finalHeight / imageRatio;
    } else if (width) {
      finalWidth = width;
      finalHeight = finalWidth * imageRatio || originalImageHeight;
    } else {
      finalHeight = originalImageHeight;
      finalWidth = finalHeight / imageRatio;
    }

    image.width = finalWidth;
    image.height = finalHeight;

    const finalCropRadius = Math.max(cropRadius, Math.min(finalWidth, finalHeight) / 3);

    const finalScale = finalHeight / originalImageHeight;
    halfImageWidth.current = finalWidth / 2;
    halfImageHeight.current = finalHeight / 2;
    lastFillPatternOffset.current = { x: halfImageWidth.current / finalScale, y: halfImageWidth.current / finalScale };

    setShowFileLoader(false);
    setImageCropRadius(finalCropRadius);
    setImageScale(finalScale);
    setImageWidth(finalWidth);
    setImageHeight(finalHeight);
    setLoadedImage(image);

    if (showPreviewOnFileLoad) {
      onEdit?.(createPreviewImage());
    }
  };

  const scaledRadius = (scale = 0) => {
    if (cropRef.current) {
      return cropRef.current.radius() - scale;
    }

    return imageCropRadius - scale;
  };

  const isLeftCorner = (scale?: number) => {
    if (cropRef.current) {
      return cropRef.current.x() - scaledRadius(scale) < 0;
    }

    return false;
  }

  const isTopCorner = (scale?: number) => {
    if (cropRef.current) {
      return cropRef.current.y() - scaledRadius(scale) < 0;
    }

    return false;
  };

  const isRightCorner = (scale?: number) => {
    if (cropRef.current && stageRef.current) {
      return cropRef.current.x() + scaledRadius(scale) > stageRef.current.width();
    }
    return false;
  };

  const isBottomCorner = (scale?: number) => {
    if (cropRef.current && stageRef.current) {
      return cropRef.current.y() + scaledRadius(scale) > stageRef.current.height();
    }

    return false;
  };

  const isNotOutOfScale = (scale: number) =>
    !isLeftCorner(scale) &&
    !isRightCorner(scale) &&
    !isBottomCorner(scale) &&
    !isTopCorner(scale);

  const calculateScaleRadius = (scale: number) => {
    if (cropRef.current) {
      return scaledRadius(scale) >= cropRadius ? scale : cropRef.current.radius() - cropRadius;
    }

    return scaledRadius(scale) >= cropRadius ? scale : imageCropRadius - cropRadius;
  };

  const calculateLeftTop = () => {
    if (cropRef.current) {
      return cropRef.current.radius() + 1;
    }

    return imageCropRadius + 1;
  };

  const calculateRight = () => {
    if (cropRef.current && stageRef.current) {
      return stageRef.current.width() - cropRef.current.radius() - 1;
    }

    return imageWidth - imageCropRadius - 1;
  };

  const calculateBottom = () => {
    if (cropRef.current && stageRef.current) {
      return stageRef.current.height() - cropRef.current.radius() - 1;
    }

    return imageHeight - imageCropRadius - 1;
  };

  const calculateResizerX = (x: number) => {
    if (cropRef.current) {
      return x + cropRef.current.radius() * 0.86;
    }

    return x + imageCropRadius * 0.86;
  };

  const calculateResizerY = (y: number) => {
    if (cropRef.current) {
      return y - cropRef.current.radius() * 0.5;
    }

    return y - imageCropRadius * 0.5;
  };

  const moveResizer = (x: number, y: number) => {
    if (resizeRef.current && resizeIconRef.current) {
      resizeRef.current.x(calculateResizerX(x) - 8);
      resizeRef.current.y(calculateResizerY(y) - 8);
      resizeIconRef.current.x(calculateResizerX(x) - 8);
      resizeIconRef.current.y(calculateResizerY(y) - 10);
    }
  };

  const calculateCropImage = () => {
    if (cropRef.current && cropStrokeRef.current) {
      const x = isLeftCorner() ? calculateLeftTop() : isRightCorner() ? calculateRight() : cropRef.current.x();
      const y = isTopCorner() ? calculateLeftTop() : isBottomCorner() ? calculateBottom() : cropRef.current.y();

      moveResizer(x, y);
      lastFillPatternOffset.current = { x: x / imageScale, y: y / imageScale };
      cropRef.current.fillPatternOffset(lastFillPatternOffset.current);
      cropRef.current.x(x);
      cropStrokeRef.current.x(x);
      cropRef.current.y(y);
      cropStrokeRef.current.y(y);
    }
  };

  const onScaleCallback = (scaleY: number) => {
    if (cropStrokeRef.current && cropRef.current && resizeRef.current) {
      const scale = scaleY > 0 || isNotOutOfScale(scaleY) ? scaleY : 0;
      cropStrokeRef.current.radius(cropStrokeRef.current.radius() - calculateScaleRadius(scale));
      cropRef.current.radius(cropRef.current.radius() - calculateScaleRadius(scale));
      calculateCropImage();
    }
  };

  const onResizeDragStart = (event: KonvaEventObject<DragEvent>) => {
    if (stageRef.current) {
      stageRef.current.container().style.cursor = 'nesw-resize';
    }

    lastMouseY.current = event.evt.y;
  };

  const onResizeDragMove = (event: KonvaEventObject<DragEvent>) => {
    const newMouseY = event.evt.y;
    const ieScaleFactor = newMouseY ? newMouseY - lastMouseY.current : undefined;
    const scaleY = event.evt.movementY || ieScaleFactor || 0;

    lastMouseY.current = newMouseY;
    onScaleCallback(scaleY);

    if (cropRef.current) {
      moveResizer(cropRef.current.x(), cropRef.current.y());
    }
  };

  const onResizeDragEnd = ()=> {
    if (stageRef.current) {
      stageRef.current.container().style.cursor = 'default';
    }

    onEdit?.(createPreviewImage());
  };

  const onCropDragEnd = () => {
    onEdit?.(createPreviewImage())
  };

  const createPreviewImage = () => {
    if (cropRef.current) {
      const widthHeight = cropRef.current.radius() * 2

      return cropRef.current.toDataURL({
        x: cropRef.current.x() - cropRef.current.radius(),
        y: cropRef.current.y() - cropRef.current.radius(),
        width: widthHeight,
        height: widthHeight,
        mimeType: 'image/png',
        quality: 1.0,
      });
    }
  };

  return (
    <div>
      {showFileLoader ? (
        <div
          style={{ width: defaultDimensions, height: defaultDimensions }}
          className="bsc:relative bsc:border-solid bsc:border-2"
        >
          <div className="bsc:absolute bsc:max-w-[80%] bsc:w-full bsc:top-1/2 bsc:left-1/2 bsc:-translate-1/2 bsc:text-center">
            <input
              type="file"
              name={fileLoaderId}
              id={fileLoaderId}
              onChange={onFileSelected}
              className="bsc:invisible bsc:absolute bsc:pointer-events-none"
            />
            <label htmlFor={fileLoaderId} className="bsc:cursor-pointer">{label}</label>
          </div>
        </div>
      ) : (
        <Stage ref={stageRef} width={imageWidth} height={imageHeight}>
          <Layer>
            <KonvaImage image={loadedImage} />
            <Rect x={0} y={0} width={imageWidth} height={imageHeight} fill={shadingColor} opacity={shadingOpacity} />
            <Group
              x={3}
              y={3}
              onClick={onRemoveFile}
              onMouseEnter={() => { if (stageRef.current) stageRef.current.container().style.cursor = 'pointer' }}
              onMouseLeave={() => { if (stageRef.current) stageRef.current.container().style.cursor = 'default' }}
            >
              <Line points={[5, 5, 20, 20]} stroke={closeColor} strokeWidth={4} />
              <Line points={[5, 20, 20, 5]} stroke={closeColor} strokeWidth={4} />
            </Group>
            <Circle
              ref={cropStrokeRef}
              x={halfImageWidth.current}
              y={halfImageHeight.current}
              radius={imageCropRadius}
              stroke={cropColor}
              strokeWidth={4}
              strokeScaleEnabled={true}
              dashEnabled={true}
              dash={[10, 5]}
            />
            <Circle
              ref={cropRef}
              x={halfImageWidth.current}
              y={halfImageHeight.current}
              radius={imageCropRadius}
              draggable={true}
              fillPatternImage={loadedImage}
              fillPatternScale={{ x: imageScale, y: imageScale }}
              fillPatternOffset={lastFillPatternOffset.current}
              onDragMove={calculateCropImage}
              onMouseEnter={() => { if (stageRef.current) stageRef.current.container().style.cursor = 'move' }}
              onMouseLeave={() => { if (stageRef.current) stageRef.current.container().style.cursor = 'default' }}
              onDragEnd={onCropDragEnd}
            />
            <Rect
              ref={resizeRef}
              x={halfImageWidth.current + imageCropRadius * 0.86 - 8}
              y={halfImageHeight.current + imageCropRadius * -0.5 - 8}
              width={16}
              height={16}
              draggable={true}
              onMouseEnter={() => { if (stageRef.current) stageRef.current.container().style.cursor = 'nesw-resize' }}
              onMouseLeave={() => { if (stageRef.current) stageRef.current.container().style.cursor = 'default' }}
              onDragStart={onResizeDragStart}
              onDragMove={onResizeDragMove}
              onDragEnd={onResizeDragEnd}
            />
            <Path
              ref={resizeIconRef}
              x={halfImageWidth.current + imageCropRadius * 0.86 - 8}
              y={halfImageHeight.current + imageCropRadius * -0.5 - 10}
              data="M47.624,0.124l12.021,9.73L44.5,24.5l10,10l14.661-15.161l9.963,12.285v-31.5H47.624z M24.5,44.5   L9.847,59.653L0,47.5V79h31.5l-12.153-9.847L34.5,54.5L24.5,44.5z"
              fill={cropColor}
              scale={{ x: 0.2, y: 0.2 }}
            />
          </Layer>
        </Stage>
      )}
    </div>
  )
};

export { AvatarEditor };

