'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Pause,
  Play,
  Home,
  BedDouble,
  Bath,
  Utensils,
  Sofa,
  Expand,
  ZoomIn,
  ZoomOut,
  Info,
  Eye
} from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface TourStop {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: typeof Home;
  hotspots?: Hotspot[];
}

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  label: string;
  targetStopId?: string;
  info?: string;
}

interface VirtualTourViewerProps {
  propertyId: number;
  propertyTitle: string;
  onClose: () => void;
}

export default function VirtualTourViewer({ propertyId, propertyTitle, onClose }: VirtualTourViewerProps) {
  const toast = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(true);

  // Simulated tour stops with different rooms
  const [tourStops] = useState<TourStop[]>([
    {
      id: 'living-room',
      name: 'Living Room',
      description: 'Spacious living area with modern furniture and natural lighting',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&h=900&fit=crop',
      icon: Sofa,
      hotspots: [
        { id: '1', x: 30, y: 50, label: 'Kitchen', targetStopId: 'kitchen' },
        { id: '2', x: 70, y: 40, label: 'Bedroom', targetStopId: 'bedroom' },
        { id: '3', x: 50, y: 60, label: 'High ceilings with recessed lighting', info: 'Energy-efficient LED lighting throughout' },
      ],
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      description: 'Fully equipped modern kitchen with stainless steel appliances',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600&h=900&fit=crop',
      icon: Utensils,
      hotspots: [
        { id: '1', x: 20, y: 50, label: 'Living Room', targetStopId: 'living-room' },
        { id: '2', x: 80, y: 45, label: 'Dining Area', info: 'Open plan dining space' },
        { id: '3', x: 50, y: 30, label: 'Stainless Steel Appliances', info: 'Includes refrigerator, oven, dishwasher' },
      ],
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      description: 'Comfortable bedroom with queen-size bed and ample storage',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&h=900&fit=crop',
      icon: BedDouble,
      hotspots: [
        { id: '1', x: 25, y: 50, label: 'Living Room', targetStopId: 'living-room' },
        { id: '2', x: 75, y: 45, label: 'Bathroom', targetStopId: 'bathroom' },
        { id: '3', x: 50, y: 70, label: 'Walk-in Closet', info: 'Large storage space with built-in shelving' },
      ],
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      description: 'Modern bathroom with walk-in shower and dual vanity',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&h=900&fit=crop',
      icon: Bath,
      hotspots: [
        { id: '1', x: 30, y: 50, label: 'Bedroom', targetStopId: 'bedroom' },
        { id: '2', x: 60, y: 40, label: 'Walk-in Shower', info: 'Rainfall showerhead with glass enclosure' },
        { id: '3', x: 70, y: 60, label: 'Dual Vanity', info: 'Quartz countertops with modern fixtures' },
      ],
    },
  ]);

  const currentStop = tourStops[currentStopIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRotate && !isDragging) {
      interval = setInterval(() => {
        setRotation((prev) => (prev + 1) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAutoRotate, isDragging]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePrevious = () => {
    setCurrentStopIndex((prev) => (prev - 1 + tourStops.length) % tourStops.length);
    setRotation(0);
    setZoom(1);
  };

  const handleNext = () => {
    setCurrentStopIndex((prev) => (prev + 1) % tourStops.length);
    setRotation(0);
    setZoom(1);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.targetStopId) {
      const targetIndex = tourStops.findIndex(stop => stop.id === hotspot.targetStopId);
      if (targetIndex !== -1) {
        setCurrentStopIndex(targetIndex);
        setRotation(0);
        setZoom(1);
        toast.success(`Navigated to ${tourStops[targetIndex].name}`);
      }
    } else if (hotspot.info) {
      toast.info(hotspot.info);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      setRotation((prev) => prev + deltaX * 0.5);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  const handleReset = () => {
    setRotation(0);
    setZoom(1);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-rose-500" />
          <div>
            <h2 className="text-xl font-bold">{propertyTitle}</h2>
            <p className="text-sm text-gray-300">Virtual Tour - {currentStop.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg transition-colors ${showInfo ? 'bg-rose-500' : 'bg-white/10 hover:bg-white/20'}`}
            title="Toggle info"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-2 rounded-lg transition-colors ${isAutoRotate ? 'bg-rose-500' : 'bg-white/10 hover:bg-white/20'}`}
            title={isAutoRotate ? 'Pause rotation' : 'Auto rotate'}
          >
            {isAutoRotate ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Reset view"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
            title="Close tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewer */}
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        <div
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div
            className="relative transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation * 0.1}deg)`,
            }}
          >
            <img
              ref={imageRef}
              src={currentStop.image}
              alt={currentStop.name}
              className="max-w-full max-h-screen object-contain select-none"
              draggable={false}
            />

            {/* Hotspots */}
            {currentStop.hotspots?.map((hotspot) => (
              <button
                key={hotspot.id}
                className="absolute w-12 h-12 -ml-6 -mt-6 bg-rose-500 hover:bg-rose-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-125 group animate-pulse"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleHotspotClick(hotspot);
                }}
              >
                <Expand className="w-5 h-5 text-white" />
                <div className="absolute bottom-full mb-2 px-3 py-1 bg-white text-gray-900 text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {hotspot.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white rounded-xl p-6 max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              {(() => {
                const Icon = currentStop.icon;
                return <Icon className="w-6 h-6 text-rose-500" />;
              })()}
              <h3 className="text-xl font-bold">{currentStop.name}</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">{currentStop.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Expand className="w-4 h-4" />
              <span>Click hotspots to navigate or get more info</span>
            </div>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="w-12 h-12 bg-black/80 backdrop-blur-sm hover:bg-black/90 rounded-lg flex items-center justify-center transition-colors text-white"
            disabled={zoom >= 3}
          >
            <ZoomIn className="w-6 h-6" />
          </button>
          <div className="w-12 h-12 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white text-sm font-bold">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={handleZoomOut}
            className="w-12 h-12 bg-black/80 backdrop-blur-sm hover:bg-black/90 rounded-lg flex items-center justify-center transition-colors text-white"
            disabled={zoom <= 1}
          >
            <ZoomOut className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/80 backdrop-blur-sm hover:bg-black/90 rounded-full flex items-center justify-center transition-all hover:scale-110 text-white shadow-2xl"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/80 backdrop-blur-sm hover:bg-black/90 rounded-full flex items-center justify-center transition-all hover:scale-110 text-white shadow-2xl"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4">
        <div className="flex items-center justify-center gap-2 overflow-x-auto">
          {tourStops.map((stop, index) => {
            const Icon = stop.icon;
            return (
              <button
                key={stop.id}
                onClick={() => {
                  setCurrentStopIndex(index);
                  setRotation(0);
                  setZoom(1);
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  index === currentStopIndex
                    ? 'bg-rose-500 shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium whitespace-nowrap">{stop.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
