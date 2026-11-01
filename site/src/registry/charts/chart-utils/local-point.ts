export interface LocalPoint {
  x: number;
  y: number;
}

interface ClientPoint {
  clientX: number;
  clientY: number;
}

/**
 * Pointer position in the user space of the root `<svg>` (group transforms
 * ignored, so callers subtract their margins).
 *
 * - `localPoint(event)` measures from `event.target`.
 * - `localPoint(node, point)` measures from `node`; pass the `<svg>` and a
 *   `Touch` for touch events.
 *
 * Falls back to the element's bounding rect when it has no owner SVG (the
 * outermost `<svg>` itself, HTML elements).
 */
export function localPoint(
  event: ClientPoint & { target: EventTarget | null }
): LocalPoint | null;
export function localPoint(node: Element, point: ClientPoint): LocalPoint;
export function localPoint(
  nodeOrEvent: Element | (ClientPoint & { target: EventTarget | null }),
  maybePoint?: ClientPoint
): LocalPoint | null {
  if (maybePoint) {
    return localPointFromNode(nodeOrEvent as Element, maybePoint);
  }
  const event = nodeOrEvent as ClientPoint & { target: EventTarget | null };
  return event.target instanceof Element
    ? localPointFromNode(event.target, event)
    : null;
}

function localPointFromNode(node: Element, point: ClientPoint): LocalPoint {
  const svg = node instanceof SVGElement ? node.ownerSVGElement : null;
  const screenCTM = svg?.getScreenCTM();
  if (svg && screenCTM) {
    const local = new DOMPoint(point.clientX, point.clientY).matrixTransform(
      screenCTM.inverse()
    );
    return { x: local.x, y: local.y };
  }
  const rect = node.getBoundingClientRect();
  return {
    x: point.clientX - rect.left - node.clientLeft,
    y: point.clientY - rect.top - node.clientTop,
  };
}
