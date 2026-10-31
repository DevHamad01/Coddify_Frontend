import { LAND_MASK_BASE64, LAND_MASK_COLUMNS, LAND_MASK_ROWS } from './land-mask';

export interface GlobePing {
  readonly lat: number;
  readonly lon: number;
  /** Short chip text, e.g. "Python · Pakistan". Empty for a dot without a label. */
  readonly label: string;
}

export interface GlobeColors {
  readonly dot: string;
  readonly accent: string;
  readonly sphere: string;
  readonly chip: string;
  readonly chipText: string;
}

interface ActivePing extends GlobePing {
  readonly bornAt: number;
}

/** Unit vectors (y up) of every land dot, spaced evenly in both directions. */
interface Point3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

const DEG = Math.PI / 180;
/**
 * Only the top cap of the globe is on screen, so tip the north pole away from the viewer:
 * the rim then sits around 60°N and the visible band covers South Asia, the Middle East,
 * Europe and Africa's north (rotation then sweeps the Americas and East Asia past).
 */
const TILT = -30 * DEG;
const ROTATION_SPEED = 0.06; // radians per second
const PING_LIFETIME = 3200; // ms
const PING_INTERVAL = 900; // ms
const MAX_PINGS = 6;

let landPoints: Point3[] | null = null;

/** Decodes the bitmap once per page and keeps the points for every globe instance. */
function buildLandPoints(): Point3[] {
  if (landPoints) {
    return landPoints;
  }
  const bytes = Uint8Array.from(atob(LAND_MASK_BASE64), (c) => c.charCodeAt(0));
  const isLand = (row: number, col: number) => {
    const k = row * LAND_MASK_COLUMNS + col;
    return (bytes[k >> 3] & (1 << (k & 7))) !== 0;
  };
  const points: Point3[] = [];
  const latStep = 1;
  for (let lat = -84; lat <= 84; lat += latStep) {
    const lonStep = latStep / Math.max(Math.cos(lat * DEG), 0.2);
    for (let lon = -180; lon < 180; lon += lonStep) {
      const row = Math.min(LAND_MASK_ROWS - 1, Math.floor(90 - lat));
      const col = Math.min(LAND_MASK_COLUMNS - 1, Math.floor(lon + 180));
      if (isLand(row, col)) {
        points.push(toVector(lat, lon));
      }
    }
  }
  landPoints = points;
  return points;
}

function toVector(lat: number, lon: number): Point3 {
  const phi = lat * DEG;
  const lambda = lon * DEG;
  return { x: Math.cos(phi) * Math.sin(lambda), y: Math.sin(phi), z: Math.cos(phi) * Math.cos(lambda) };
}

/**
 * Draws a slowly rotating dotted earth on a 2D canvas (orthographic projection, no WebGL).
 * The component owns sizing and the animation loop; this class only knows how to paint a frame.
 */
export class GlobeRenderer {
  private readonly points = buildLandPoints();
  private readonly pings: ActivePing[] = [];
  private rotation = -1.2; // start with Asia / Europe facing the viewer
  private lastPingAt = 0;
  private nextPingIndex = 0;

  private width = 0;
  private height = 0;
  private dpr = 1;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly feed: readonly GlobePing[],
  ) {}

  resize(width: number, height: number, dpr: number): void {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
  }

  /** Globe geometry: wide and partly below the fold, like a horizon. `top` is where its rim starts. */
  geometry(top: number): { cx: number; cy: number; r: number } {
    const r = Math.max(220, Math.min(this.width * 0.42, 560));
    return { cx: this.width / 2, cy: top + r, r };
  }

  frame(now: number, dtSeconds: number, top: number, colors: GlobeColors, animate: boolean): void {
    const { ctx, dpr } = this;
    if (animate) {
      this.rotation += ROTATION_SPEED * dtSeconds;
      this.spawnPings(now);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);

    const { cx, cy, r } = this.geometry(top);
    this.drawSphere(cx, cy, r, colors);
    this.drawLand(cx, cy, r, colors);
    this.drawPings(now, cx, cy, r, colors);
  }

  private project(p: Point3, cx: number, cy: number, r: number) {
    const cosR = Math.cos(this.rotation);
    const sinR = Math.sin(this.rotation);
    const x1 = p.x * cosR + p.z * sinR;
    const z1 = -p.x * sinR + p.z * cosR;
    const y2 = p.y * Math.cos(TILT) - z1 * Math.sin(TILT);
    const z2 = p.y * Math.sin(TILT) + z1 * Math.cos(TILT);
    return { sx: cx + x1 * r, sy: cy - y2 * r, depth: z2 };
  }

  private drawSphere(cx: number, cy: number, r: number, colors: GlobeColors): void {
    const { ctx } = this;
    // Soft halo outside the rim.
    const halo = ctx.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.12);
    halo.addColorStop(0, withAlpha(colors.accent, 0.22));
    halo.addColorStop(1, withAlpha(colors.accent, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fill();

    // Opaque body so anything behind it (the robot's legs) is hidden.
    const body = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.6, r * 0.1, cx, cy, r);
    body.addColorStop(0, colors.sphere);
    body.addColorStop(1, shade(colors.sphere, -10));
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = withAlpha(colors.accent, 0.75);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  private drawLand(cx: number, cy: number, r: number, colors: GlobeColors): void {
    const { ctx } = this;
    const size = Math.max(1.4, r / 260);
    ctx.fillStyle = colors.dot;
    for (const point of this.points) {
      const { sx, sy, depth } = this.project(point, cx, cy, r);
      if (depth <= 0.02 || sy > this.height + 4) {
        continue;
      }
      // Dots near the limb fade out and shrink, which sells the curvature.
      ctx.globalAlpha = 0.18 + 0.72 * depth;
      const s = size * (0.55 + 0.45 * depth);
      ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }

  private spawnPings(now: number): void {
    while (this.pings.length && now - this.pings[0].bornAt > PING_LIFETIME) {
      this.pings.shift();
    }
    if (!this.feed.length || now - this.lastPingAt < PING_INTERVAL || this.pings.length >= MAX_PINGS) {
      return;
    }
    this.lastPingAt = now;
    this.pings.push({ ...this.feed[this.nextPingIndex % this.feed.length], bornAt: now });
    this.nextPingIndex++;
  }

  private drawPings(now: number, cx: number, cy: number, r: number, colors: GlobeColors): void {
    const { ctx } = this;
    for (const ping of this.pings) {
      const { sx, sy, depth } = this.project(toVector(ping.lat, ping.lon), cx, cy, r);
      if (depth <= 0.15 || sy > this.height - 8) {
        continue;
      }
      const age = (now - ping.bornAt) / PING_LIFETIME;
      const fade = age < 0.15 ? age / 0.15 : age > 0.8 ? (1 - age) / 0.2 : 1;

      ctx.globalAlpha = (1 - age) * depth;
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 3 + age * 16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = fade * depth;
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();

      if (ping.label) {
        // Chips stay readable even near the limb; only the fade in/out applies.
        ctx.globalAlpha = fade;
        this.drawChip(ping.label, sx, sy, colors);
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawChip(label: string, x: number, y: number, colors: GlobeColors): void {
    const { ctx } = this;
    ctx.font = '600 12px Inter, system-ui, sans-serif';
    const w = ctx.measureText(label).width + 20;
    const h = 24;
    const left = Math.min(Math.max(x + 10, 4), this.width - w - 4);
    const top = y - h - 8;
    ctx.fillStyle = colors.chip;
    ctx.beginPath();
    ctx.roundRect(left, top, w, h, 12);
    ctx.fill();
    ctx.strokeStyle = withAlpha(colors.accent, 0.4);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = colors.chipText;
    ctx.textBaseline = 'middle';
    ctx.fillText(label, left + 10, top + h / 2 + 0.5);
  }
}

/** Accepts "r g b" token channels or a hex colour and returns an rgba() string. */
export function withAlpha(color: string, alpha: number): string {
  const [r, g, b] = channels(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shade(color: string, amount: number): string {
  const [r, g, b] = channels(color).map((c) => Math.max(0, Math.min(255, c + amount)));
  return `rgb(${r}, ${g}, ${b})`;
}

function channels(color: string): number[] {
  const value = color.trim();
  if (value.startsWith('#')) {
    const hex = value.slice(1);
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }
  return value
    .replace(/rgba?\(|\)/g, '')
    .split(/[\s,/]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(Number);
}
