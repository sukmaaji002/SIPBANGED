import { useRef, useState, type PointerEvent } from 'react';

type Point = { x: number; y: number };
type View = Point & { scale: number };
type Pinch = { distance: number; center: Point; view: View };
const initialView = { x: 0, y: 0, scale: 1 };

function pinchBetween(points: Map<number, Point>, view: View): Pinch | undefined {
  const [first, second] = points.values();
  if (!first || !second) return;
  return {
    distance: Math.max(1, Math.hypot(second.x - first.x, second.y - first.y)),
    center: { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 },
    view,
  };
}

export function ReportPhotoImage({ src, alt, onSwipe }: {
  src: string;
  alt: string;
  onSwipe?: (direction: -1 | 1) => void;
}) {
  const image = useRef<HTMLImageElement>(null);
  const currentView = useRef(initialView);
  const [view, setView] = useState(initialView);
  const gesture = useRef({
    points: new Map<number, Point>(),
    start: undefined as Point | undefined,
    pinch: undefined as Pinch | undefined,
  });

  const updateView = (next: View) => {
    const img = image.current;
    if (!img?.naturalWidth || !img.naturalHeight) return;
    const fit = Math.min(img.clientWidth / img.naturalWidth, img.clientHeight / img.naturalHeight);
    const maxX = Math.max(0, (img.naturalWidth * fit * next.scale - img.clientWidth) / 2);
    const maxY = Math.max(0, (img.naturalHeight * fit * next.scale - img.clientHeight) / 2);
    const bounded = {
      scale: next.scale,
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
    };
    currentView.current = bounded;
    setView(bounded);
  };

  const startPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') return;
    const { points } = gesture.current;
    const point = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    points.set(event.pointerId, point);
    gesture.current.start = points.size === 1 && currentView.current.scale === 1 && onSwipe ? point : undefined;
    gesture.current.pinch = pinchBetween(points, currentView.current);
  };

  const movePointer = (event: PointerEvent<HTMLDivElement>) => {
    const { points, start, pinch } = gesture.current;
    const previous = points.get(event.pointerId);
    if (!previous) return;
    const point = { x: event.clientX, y: event.clientY };
    points.set(event.pointerId, point);

    if (pinch) {
      const next = pinchBetween(points, currentView.current);
      if (!next) return;
      const scale = Math.max(1, Math.min(4, pinch.view.scale * next.distance / pinch.distance));
      const ratio = scale / pinch.view.scale;
      const box = event.currentTarget.getBoundingClientRect();
      const centerX = box.left + box.width / 2;
      const centerY = box.top + box.height / 2;
      updateView({
        scale,
        x: next.center.x - centerX - (pinch.center.x - centerX - pinch.view.x) * ratio,
        y: next.center.y - centerY - (pinch.center.y - centerY - pinch.view.y) * ratio,
      });
      return;
    }

    const dx = point.x - previous.x;
    const dy = point.y - previous.y;
    const active = currentView.current;
    if (active.scale > 1) {
      updateView({ ...active, x: active.x + dx, y: active.y + dy });
    } else if (!start || (Math.abs(point.y - start.y) > 10 && Math.abs(point.y - start.y) >= Math.abs(point.x - start.x))) {
      gesture.current.start = undefined;
      event.currentTarget.parentElement?.scrollBy(0, -dy);
    }
  };

  const endPointer = (event: PointerEvent<HTMLDivElement>) => {
    const state = gesture.current;
    if (!state.points.delete(event.pointerId)) return;
    const start = state.start;
    state.start = undefined;
    state.pinch = pinchBetween(state.points, currentView.current);
    if (event.type !== 'pointerup' || !start || state.points.size || currentView.current.scale > 1) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 50 && Math.abs(dx) >= 1.2 * Math.abs(dy)) onSwipe?.(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="touch-none overflow-hidden bg-slate-950"
      onPointerDown={startPointer}
      onPointerMove={movePointer}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onLostPointerCapture={endPointer}
    >
      <img
        ref={image}
        src={src}
        alt={alt}
        draggable={false}
        className="block max-h-[72dvh] w-full select-none object-contain"
        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
      />
    </div>
  );
}
