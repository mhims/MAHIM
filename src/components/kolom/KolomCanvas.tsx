import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PenEntity, PenConfig, GameMode, AIDifficulty, TableTheme, AimControlMode } from '../../types/kolomGame';
import { playFlickSound, playHitSound, playFallSound } from '../../utils/kolomSoundEffects';

interface KolomCanvasProps {
  player1Pen: PenConfig;
  player2Pen: PenConfig;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  tableTheme: TableTheme;
  aimMode?: AimControlMode;
  currentTurn: 'player1' | 'player2';
  isSimulating: boolean;
  roundStateKey: number;
  onTurnEnd: (fallenPen: 'player1' | 'player2' | 'both' | null) => void;
  onSimulationChange: (simulating: boolean) => void;
}

export const KolomCanvas: React.FC<KolomCanvasProps> = ({
  player1Pen,
  player2Pen,
  gameMode,
  aiDifficulty,
  tableTheme,
  aimMode = 'slingshot' as AimControlMode,
  currentTurn,
  isSimulating,
  roundStateKey,
  onTurnEnd,
  onSimulationChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dragging State for Aiming
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [aiAiming, setAiAiming] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    powerRatio: number;
  } | null>(null);

  // Virtual Canvas Coordinate Space (1050 x 580)
  const virtualWidth = 1050;
  const virtualHeight = 580;
  // Wooden Bench Margins
  const tableMarginX = 64;
  const tableMarginY = 50;

  // Entities stored in ref for 60fps physics simulation
  const entitiesRef = useRef<{ p1: PenEntity; p2: PenEntity }>({
    p1: createPenEntity('player1', 'You', player1Pen, 380, 290, 0),
    p2: createPenEntity(
      'player2',
      gameMode === 'vs-computer' ? 'Computer' : 'Player 2',
      player2Pen,
      670,
      290,
      Math.PI
    ),
  });

  function createPenEntity(
    id: 'player1' | 'player2',
    name: string,
    config: PenConfig,
    x: number,
    y: number,
    angle: number
  ): PenEntity {
    return {
      id,
      name,
      config,
      x,
      y,
      vx: 0,
      vy: 0,
      angle,
      vRot: 0,
      isFalling: false,
      fallProgress: 0,
      fallScale: 1,
      fallRotation: 0,
      isOffTable: false,
    };
  }

  // Reset pens to starting positions on new round
  const resetPens = useCallback(() => {
    // Strategic starting placement on the table
    const p1X = 380;
    const p1Y = 290;
    const p2X = 670;
    const p2Y = 290;

    entitiesRef.current = {
      p1: createPenEntity('player1', 'You', player1Pen, p1X, p1Y, -0.05),
      p2: createPenEntity(
        'player2',
        gameMode === 'vs-computer' ? 'Computer' : 'Player 2',
        player2Pen,
        p2X,
        p2Y,
        Math.PI + 0.05
      ),
    };
    setDragStart(null);
    setDragCurrent(null);
    setAiAiming(null);
  }, [player1Pen, player2Pen, gameMode]);

  useEffect(() => {
    resetPens();
  }, [roundStateKey, resetPens]);

  // AI Turn Handling
  useEffect(() => {
    if (gameMode !== 'vs-computer') return;
    if (currentTurn !== 'player2') return;
    if (isSimulating) return;

    const { p1, p2 } = entitiesRef.current;
    if (p1.isOffTable || p2.isOffTable) return;

    const thinkTimer = setTimeout(() => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.hypot(dx, dy);

      const targetAngle = Math.atan2(dy, dx);

      let angleVariance = 0;
      let powerFactor = 1;

      if (aiDifficulty === 'easy') {
        angleVariance = (Math.random() - 0.5) * 0.32;
        powerFactor = 0.65 + Math.random() * 0.25;
      } else if (aiDifficulty === 'medium') {
        angleVariance = (Math.random() - 0.5) * 0.1;
        powerFactor = 0.85 + Math.random() * 0.2;
      } else {
        angleVariance = (Math.random() - 0.5) * 0.025;
        powerFactor = 0.98 + Math.random() * 0.12;
      }

      const finalAngle = targetAngle + angleVariance;

      const neededSpeed = Math.min(
        14,
        Math.max(5.5, (dist / 48) * powerFactor * (p2.config.speed / 3))
      );
      const impulseX = Math.cos(finalAngle) * neededSpeed;
      const impulseY = Math.sin(finalAngle) * neededSpeed;

      const aimDist = neededSpeed * 7;
      setAiAiming({
        startX: p2.x,
        startY: p2.y,
        endX: p2.x + Math.cos(finalAngle) * aimDist,
        endY: p2.y + Math.sin(finalAngle) * aimDist,
        powerRatio: Math.min(1, neededSpeed / 14),
      });

      const shootTimer = setTimeout(() => {
        setAiAiming(null);
        p2.vx = impulseX;
        p2.vy = impulseY;
        // Pen shoots with zero initial spin - moves smoothly like a real pen!
        p2.vRot = 0;

        playFlickSound();
        onSimulationChange(true);
      }, 700);

      return () => clearTimeout(shootTimer);
    }, 700);

    return () => clearTimeout(thinkTimer);
  }, [currentTurn, gameMode, isSimulating, aiDifficulty, onSimulationChange]);

  // Main 60fps Game Loop & REALISTIC PHYSICS ENGINE
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const tableLeft = tableMarginX;
    const tableTop = tableMarginY;
    const tableRight = virtualWidth - tableMarginX;
    const tableBottom = virtualHeight - tableMarginY;

    const gameLoop = () => {
      const { p1, p2 } = entitiesRef.current;
      let anyMoving = false;

      // 1. UPDATE MOVEMENT WITH HIGH REALISTIC WOOD FRICTION & HEAVY ROTATIONAL BRAKING
      [p1, p2].forEach((pen) => {
        if (pen.isOffTable) return;

        if (pen.isFalling) {
          pen.fallProgress += 0.045;
          pen.fallScale = Math.max(0.05, 1 - pen.fallProgress * 0.9);
          pen.fallRotation += 0.08;
          pen.vx *= 0.93;
          pen.vy *= 0.93;
          pen.x += pen.vx;
          pen.y += pen.vy;

          if (pen.fallProgress >= 1) {
            pen.isOffTable = true;
          }
          anyMoving = true;
          return;
        }

        const speed = Math.hypot(pen.vx, pen.vy);
        const rotSpeed = Math.abs(pen.vRot);

        if (speed > 0.03 || rotSpeed > 0.002) {
          anyMoving = true;

          // Apply velocity
          pen.x += pen.vx;
          pen.y += pen.vy;
          pen.angle += pen.vRot;

          // Realistic Wood Surface Sliding Friction:
          // Pen naturally glides and smoothly stops without sliding indefinitely
          const baseFriction = 0.952;
          const configModifier = (pen.config.friction - 3) * 0.006;
          const frictionRate = Math.max(0.92, baseFriction - configModifier);
          pen.vx *= frictionRate;
          pen.vy *= frictionRate;

          // CRITICAL PHYSICS FIX: HEAVY ROTATIONAL DAMPING!
          // A pen is a long solid cylinder resting on wood across its entire length.
          // Friction opposes rotation intensely, so rotation dies out almost instantly (0.58 decay).
          pen.vRot *= 0.58;

          // Cap maximum rotation so pens NEVER spin wildly like a helicopter!
          pen.vRot = Math.max(-0.025, Math.min(0.025, pen.vRot));
        } else {
          pen.vx = 0;
          pen.vy = 0;
          pen.vRot = 0;
        }

        // 2. REALISTIC EDGE OVERHANG / FALL DETECTION
        // In Pen Fight: if >50% of the pen hangs over the edge or center of gravity goes over, it tilts and falls!
        const halfL = pen.config.length / 2;
        const cosA = Math.cos(pen.angle);
        const sinA = Math.sin(pen.angle);

        const tipX = pen.x + cosA * halfL;
        const tipY = pen.y + sinA * halfL;
        const tailX = pen.x - cosA * halfL;
        const tailY = pen.y - sinA * halfL;

        let pointsOutside = 0;
        const samplePoints = [
          { x: tipX, y: tipY },
          { x: pen.x + cosA * (halfL * 0.5), y: pen.y + sinA * (halfL * 0.5) },
          { x: pen.x, y: pen.y }, // Center of gravity
          { x: pen.x - cosA * (halfL * 0.5), y: pen.y - sinA * (halfL * 0.5) },
          { x: tailX, y: tailY },
        ];

        samplePoints.forEach((pt) => {
          if (pt.x < tableLeft || pt.x > tableRight || pt.y < tableTop || pt.y > tableBottom) {
            pointsOutside++;
          }
        });

        const centerIsOut =
          pen.x < tableLeft || pen.x > tableRight || pen.y < tableTop || pen.y > tableBottom;

        if ((centerIsOut || pointsOutside >= 3) && !pen.isFalling) {
          pen.isFalling = true;
          pen.fallProgress = 0;
          playFallSound();
        }
      });

      // 3. COLLISION DETECTION: Single-pass rigid body impact (no compounding impulses!)
      if (!p1.isFalling && !p2.isFalling && !p1.isOffTable && !p2.isOffTable) {
        checkPenCollision(p1, p2);
      }

      // 4. CHECK SIMULATION SETTLED
      if (isSimulating && !anyMoving) {
        onSimulationChange(false);

        let fallen: 'player1' | 'player2' | 'both' | null = null;
        if (p1.isOffTable && p2.isOffTable) {
          fallen = 'both';
        } else if (p1.isOffTable) {
          fallen = 'player1';
        } else if (p2.isOffTable) {
          fallen = 'player2';
        }

        onTurnEnd(fallen);
      }

      // 5. RENDER SCENE
      renderScene(ctx, p1, p2);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isSimulating, onSimulationChange, onTurnEnd, tableMarginX, tableMarginY]);

  // SINGLE-PASS ACCURATE RIGID BODY PEN COLLISION
  // Solves the "অতিরিক্ত ঘুরছে" issue by finding the single closest contact point and applying ONE realistic impulse!
  const checkPenCollision = (p1: PenEntity, p2: PenEntity) => {
    const numPoints = 5;
    const r1 = p1.config.width / 2;
    const r2 = p2.config.width / 2;
    const minDist = r1 + r2;

    const cos1 = Math.cos(p1.angle);
    const sin1 = Math.sin(p1.angle);
    const halfL1 = p1.config.length / 2;

    const cos2 = Math.cos(p2.angle);
    const sin2 = Math.sin(p2.angle);
    const halfL2 = p2.config.length / 2;

    let closestDist = Infinity;
    let contactInfo: {
      c1X: number;
      c1Y: number;
      c2X: number;
      c2Y: number;
      t1: number;
      t2: number;
    } | null = null;

    // Find the single point of deepest penetration
    for (let i = 0; i < numPoints; i++) {
      const t1 = (i / (numPoints - 1) - 0.5) * 2 * halfL1;
      const c1X = p1.x + cos1 * t1;
      const c1Y = p1.y + sin1 * t1;

      for (let j = 0; j < numPoints; j++) {
        const t2 = (j / (numPoints - 1) - 0.5) * 2 * halfL2;
        const c2X = p2.x + cos2 * t2;
        const c2Y = p2.y + sin2 * t2;

        const dist = Math.hypot(c2X - c1X, c2Y - c1Y);

        if (dist < minDist && dist < closestDist) {
          closestDist = dist;
          contactInfo = { c1X, c1Y, c2X, c2Y, t1, t2 };
        }
      }
    }

    // Apply SINGLE impulse resolution only once per frame
    if (contactInfo && closestDist > 0.001) {
      const { c1X, c1Y, c2X, c2Y, t1, t2 } = contactInfo;
      const nx = (c2X - c1X) / closestDist;
      const ny = (c2Y - c1Y) / closestDist;

      const rvx = p2.vx - p1.vx;
      const rvy = p2.vy - p1.vy;
      const velAlongNormal = rvx * nx + rvy * ny;

      // Only resolve if closing in
      if (velAlongNormal < 0) {
        // Restitution: 0.55 for authentic plastic pen clack
        const restitution = 0.55;
        const m1 = p1.config.weight;
        const m2 = p2.config.weight;

        const impulseMag = (-(1 + restitution) * velAlongNormal) / (1 / m1 + 1 / m2);

        // Linear velocity update
        p1.vx -= (impulseMag / m1) * nx;
        p1.vy -= (impulseMag / m1) * ny;
        p2.vx += (impulseMag / m2) * nx;
        p2.vy += (impulseMag / m2) * ny;

        // REALISTIC CONTROLLED TORQUE:
        // Moment of inertia for thin rod of length L is (1/12) * M * L^2
        // We calculate gentle angular deflection (e.g. slight turn, NOT crazy spinning!)
        const perp1 = nx * (-sin1) + ny * cos1;
        const perp2 = nx * (-sin2) + ny * cos2;

        const angularImpulse1 = (t1 / halfL1) * perp1 * (impulseMag / m1) * 0.018;
        const angularImpulse2 = (t2 / halfL2) * perp2 * (impulseMag / m2) * 0.018;

        p1.vRot = Math.max(-0.025, Math.min(0.025, p1.vRot - angularImpulse1));
        p2.vRot = Math.max(-0.025, Math.min(0.025, p2.vRot + angularImpulse2));

        // Separate overlapping bodies cleanly
        const overlap = (minDist - closestDist) * 0.52;
        p1.x -= nx * overlap;
        p1.y -= ny * overlap;
        p2.x += nx * overlap;
        p2.y += ny * overlap;

        const hitSpeed = Math.abs(velAlongNormal);
        playHitSound(hitSpeed);
      }
    }
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = virtualWidth / rect.width;
    const scaleY = virtualHeight / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSimulating) return;
    if (gameMode === 'vs-computer' && currentTurn !== 'player1') return;

    const coords = getCanvasCoords(e);
    const activePen = currentTurn === 'player1' ? entitiesRef.current.p1 : entitiesRef.current.p2;

    if (activePen.isOffTable || activePen.isFalling) return;

    const dist = Math.hypot(coords.x - activePen.x, coords.y - activePen.y);
    if (dist < 110) {
      setDragStart({ x: activePen.x, y: activePen.y });
      setDragCurrent(coords);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStart) return;
    const coords = getCanvasCoords(e);
    setDragCurrent(coords);
  };

  const handlePointerUp = () => {
    if (!dragStart || !dragCurrent) {
      setDragStart(null);
      setDragCurrent(null);
      return;
    }

    const activePen = currentTurn === 'player1' ? entitiesRef.current.p1 : entitiesRef.current.p2;

    // Vector calculation
    let shootVectorX = 0;
    let shootVectorY = 0;

    if (aimMode === 'slingshot') {
      // Pull backward, shoot forward
      shootVectorX = dragStart.x - dragCurrent.x;
      shootVectorY = dragStart.y - dragCurrent.y;
    } else {
      // Direct drag: drag forward, shoot forward
      shootVectorX = dragCurrent.x - dragStart.x;
      shootVectorY = dragCurrent.y - dragStart.y;
    }

    const pullDist = Math.hypot(shootVectorX, shootVectorY);

    if (pullDist > 12) {
      const maxPull = 150;
      const clampedPull = Math.min(maxPull, pullDist);
      const ratio = clampedPull / maxPull;
      const curvedRatio = Math.pow(ratio, 1.15);

      const maxLaunchSpeed = 15.5 * (activePen.config.speed / 3.2);
      const launchSpeed = curvedRatio * maxLaunchSpeed;

      const angle = Math.atan2(shootVectorY, shootVectorX);
      activePen.vx = Math.cos(angle) * launchSpeed;
      activePen.vy = Math.sin(angle) * launchSpeed;

      // When flicked, pen moves forward cleanly with ZERO random spin!
      activePen.vRot = 0;

      playFlickSound();
      onSimulationChange(true);
    }

    setDragStart(null);
    setDragCurrent(null);
  };

  // Render Scene: Realistic School Bench Table, Pens, & Crystal Clear Aiming Beam
  const renderScene = (ctx: CanvasRenderingContext2D, p1: PenEntity, p2: PenEntity) => {
    ctx.clearRect(0, 0, virtualWidth, virtualHeight);

    // 1. SURROUNDING CLASSROOM FLOOR
    ctx.fillStyle = '#181411';
    ctx.fillRect(0, 0, virtualWidth, virtualHeight);

    const tableLeft = tableMarginX;
    const tableTop = tableMarginY;
    const tableRight = virtualWidth - tableMarginX;
    const tableBottom = virtualHeight - tableMarginY;
    const tableW = tableRight - tableLeft;
    const tableH = tableBottom - tableTop;
    const tableRadius = 18;

    // 2. REALISTIC TABLE DEPTH & RUSTIC WOODEN BENCH THICKNESS
    ctx.save();
    // Deep cast shadow on floor
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.roundRect(tableLeft + 8, tableTop + 16, tableW, tableH + 12, tableRadius);
    ctx.fill();

    // 3D Front Wood Edge (Bench thickness)
    ctx.fillStyle = '#23150d';
    ctx.beginPath();
    ctx.roundRect(tableLeft, tableTop + 8, tableW, tableH + 6, tableRadius);
    ctx.fill();
    ctx.restore();

    // 3. AUTHENTIC SCHOOL BENCH SURFACE WITH SCRATCHES, INK STAINS, & CHALK
    drawAuthenticSchoolTable(ctx, tableLeft, tableTop, tableW, tableH, tableRadius);

    // 4. DRAW FALLING PENS (Shrinking & fading below table)
    if (p1.isFalling) drawPen(ctx, p1);
    if (p2.isFalling) drawPen(ctx, p2);

    // 5. DRAW ACTIVE ON-DESK PENS
    if (!p1.isFalling && !p1.isOffTable) drawPen(ctx, p1);
    if (!p2.isFalling && !p2.isOffTable) drawPen(ctx, p2);

    // 6. LABELS UNDER THE PENS ("You" / "Computer")
    drawPenLabels(ctx, p1, p2);

    // 7. CRYSTAL CLEAR TRAJECTORY AIMING HUD
    if (!isSimulating) {
      const activePen = currentTurn === 'player1' ? p1 : p2;

      if (dragStart && dragCurrent) {
        drawCrystalClearAimHUD(ctx, dragStart, dragCurrent, activePen, (aimMode || 'slingshot') as AimControlMode);
      } else if (!activePen.isOffTable && !activePen.isFalling) {
        // Resting turn indicator pulse
        drawActivePenGlow(ctx, activePen);
      }

      // Draw AI Aiming if AI's turn
      if (aiAiming) {
        drawAIAiming(ctx, aiAiming);
      }
    }
  };

  // AUTHENTIC SCHOOL TABLE RENDERER
  // Addresses: "টেবিল এতো চককে আর এতো সোজা হবেনা। কারণ স্কুলে এতো সুন্দর থাকে না।"
  const drawAuthenticSchoolTable = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.clip();

    if (tableTheme === 'scratched-wood') {
      // 1. ক্লাসরুমের দাগওয়ালা পুরোনো কাঠের বেঞ্চ (Authentic High School Wood Bench)
      // Planks background
      const baseGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      baseGrad.addColorStop(0, '#533118');
      baseGrad.addColorStop(0.3, '#5c371b');
      baseGrad.addColorStop(0.7, '#482a14');
      baseGrad.addColorStop(1, '#3a200d');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(x, y, w, h);

      // Horizontal Wooden Plank Seams (স্কুলের বেঞ্চের ৩টি কাঠের তক্তা)
      const plankY1 = y + h * 0.33;
      const plankY2 = y + h * 0.66;
      [plankY1, plankY2].forEach((py) => {
        // Dark groove
        ctx.strokeStyle = '#221106';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(x, py);
        ctx.lineTo(x + w, py);
        ctx.stroke();

        // Highlight seam on bottom edge of plank
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, py + 2);
        ctx.lineTo(x + w, py + 2);
        ctx.stroke();

        // Rusty iron nails holding planks
        [x + 40, x + w * 0.28, x + w * 0.55, x + w * 0.8, x + w - 40].forEach((nx) => {
          ctx.fillStyle = '#1b120c';
          ctx.beginPath();
          ctx.arc(nx, py - 10, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#422817';
          ctx.beginPath();
          ctx.arc(nx - 1, py - 11, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Rough Wood Grain & Knots
      ctx.strokeStyle = 'rgba(30, 15, 6, 0.4)';
      ctx.lineWidth = 1.6;
      for (let gy = y + 15; gy < y + h; gy += 24) {
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.bezierCurveTo(
          x + w * 0.3,
          gy + Math.sin(gy * 0.08) * 16,
          x + w * 0.7,
          gy - Math.cos(gy * 0.06) * 14,
          x + w,
          gy + 4
        );
        ctx.stroke();
      }

      // Compass Scratched Circles & Markings ("কম্পাসের দাগ")
      ctx.strokeStyle = 'rgba(235, 190, 140, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x + 220, y + 130, 42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 220, y + 130, 22, 0, Math.PI * 2);
      ctx.stroke();
      // Center needle hole
      ctx.fillStyle = '#140803';
      ctx.beginPath();
      ctx.arc(x + 220, y + 130, 2, 0, Math.PI * 2);
      ctx.fill();

      // Carved student graffiti: "Roll 14", "SSC 09", "M + S ❤️"
      ctx.fillStyle = 'rgba(235, 195, 150, 0.4)';
      ctx.font = 'bold 15px "Hind Siliguri", monospace';
      ctx.fillText('ROLL 14', x + 75, y + 60);
      ctx.fillText('SSC 09', x + w - 170, y + 65);
      ctx.fillText('M + S ❤️', x + w - 210, y + h - 50);

      // Leaked Royal Blue Ink Stains & Splatters ("কালির ফোঁটা")
      ctx.fillStyle = 'rgba(29, 78, 216, 0.45)';
      ctx.beginPath();
      ctx.ellipse(x + 460, y + 190, 22, 14, 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Ink splatter droplets
      [
        { dx: 26, dy: 6, r: 4 },
        { dx: -20, dy: -8, r: 3 },
        { dx: 14, dy: 16, r: 2.5 },
        { dx: -12, dy: 14, r: 2 },
      ].forEach((d) => {
        ctx.beginPath();
        ctx.arc(x + 460 + d.dx, y + 190 + d.dy, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Red Ink Stain from red ballpen
      ctx.fillStyle = 'rgba(185, 28, 28, 0.35)';
      ctx.beginPath();
      ctx.arc(x + 690, y + 360, 14, 0, Math.PI * 2);
      ctx.fill();

      // Faint Chalk Dust Streaks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.ellipse(x + w * 0.4, y + h * 0.75, 140, 25, -0.1, 0, Math.PI * 2);
      ctx.fill();

    } else if (tableTheme === 'green-board') {
      // 2. সবুজ ক্লাসরুম ডেস্ক (Weathered Green Classroom Painted Desk)
      const greenGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      greenGrad.addColorStop(0, '#1b3b2b');
      greenGrad.addColorStop(0.5, '#234937');
      greenGrad.addColorStop(1, '#152e22');
      ctx.fillStyle = greenGrad;
      ctx.fillRect(x, y, w, h);

      // Chipped Paint Corners revealing raw wood beneath
      ctx.fillStyle = '#6b4320';
      ctx.beginPath();
      ctx.arc(x + 12, y + 12, 28, 0, Math.PI / 2);
      ctx.lineTo(x, y);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + w - 12, y + h - 12, 32, Math.PI, (Math.PI * 3) / 2);
      ctx.lineTo(x + w, y + h);
      ctx.fill();

      // Carved Compass marks and ruler lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(x + 160 + i * 20, y + 80);
        ctx.lineTo(x + 160 + i * 20, y + 100);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(x + 155, y + 100);
      ctx.lineTo(x + 315, y + 100);
      ctx.stroke();

      // Student Scribbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = 'bold 13px "Hind Siliguri", monospace';
      ctx.fillText('(a + b)² = a² + 2ab + b²', x + 160, y + 68);
      ctx.fillText('Class 9 • Sec A', x + w - 210, y + 85);

      // Leaked ink blot
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.beginPath();
      ctx.ellipse(x + 480, y + 320, 20, 12, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Chalk dust
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.ellipse(x + 350, y + 240, 180, 45, 0.15, 0, Math.PI * 2);
      ctx.fill();

    } else if (tableTheme === 'dark-teak') {
      // 3. গাঢ় সেগুন কাঠের বেঞ্চ (Deep Teak Wood)
      const woodGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      woodGrad.addColorStop(0, '#361e11');
      woodGrad.addColorStop(0.4, '#442616');
      woodGrad.addColorStop(0.8, '#2e180d');
      woodGrad.addColorStop(1, '#241208');
      ctx.fillStyle = woodGrad;
      ctx.fillRect(x, y, w, h);

      // Deep wood grain
      ctx.strokeStyle = 'rgba(18, 8, 3, 0.45)';
      ctx.lineWidth = 1.8;
      for (let gy = y + 20; gy < y + h; gy += 32) {
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.bezierCurveTo(x + w * 0.35, gy + 18, x + w * 0.65, gy - 14, x + w, gy + 6);
        ctx.stroke();
      }

      // Large tree ring knot
      ctx.strokeStyle = 'rgba(15, 6, 2, 0.35)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(x + w * 0.52, y + h * 0.48, 95, 30, 0.08, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x + w * 0.52, y + h * 0.48, 55, 16, 0.08, 0, Math.PI * 2);
      ctx.stroke();

      // Subtle student compass mark
      ctx.strokeStyle = 'rgba(200, 160, 120, 0.22)';
      ctx.beginPath();
      ctx.arc(x + 180, y + 200, 30, 0, Math.PI * 2);
      ctx.stroke();

    } else if (tableTheme === 'notebook-desk') {
      // 4. খাতা ও মার্জিন পেপারের ডেস্ক (Bangla Ruled Notebook Paper Table)
      ctx.fillStyle = '#f8f6ee';
      ctx.fillRect(x, y, w, h);

      // Left Red Vertical Margin Line (খাতার লাল মার্জিন)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(x + 95, y);
      ctx.lineTo(x + 95, y + h);
      ctx.stroke();

      // Horizontal Ruled Blue Lines (খাতার নীল দাগ)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.lineWidth = 1.2;
      for (let ly = y + 36; ly < y + h; ly += 30) {
        ctx.beginPath();
        ctx.moveTo(x, ly);
        ctx.lineTo(x + w, ly);
        ctx.stroke();
      }

      // Doodles in the margin: Tic-Tac-Toe & star
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.45)';
      ctx.lineWidth = 1.5;
      // Tic tac toe grid
      ctx.beginPath();
      ctx.moveTo(x + 25, y + 80);
      ctx.lineTo(x + 75, y + 80);
      ctx.moveTo(x + 25, y + 105);
      ctx.lineTo(x + 75, y + 105);
      ctx.moveTo(x + 42, y + 65);
      ctx.lineTo(x + 42, y + 120);
      ctx.moveTo(x + 58, y + 65);
      ctx.lineTo(x + 58, y + 120);
      ctx.stroke();

      // Handwriting note
      ctx.fillStyle = 'rgba(30, 58, 138, 0.45)';
      ctx.font = '13px "Hind Siliguri", sans-serif';
      ctx.fillText('বাঙালি ও বাংলা ব্যাকরণ', x + 115, y + 28);
      ctx.fillText('তারিখ: ১২/০৪/২০০৮', x + w - 160, y + 28);

      // Blue ink blot
      ctx.fillStyle = 'rgba(29, 78, 216, 0.35)';
      ctx.beginPath();
      ctx.arc(x + 540, y + 270, 16, 0, Math.PI * 2);
      ctx.arc(x + 555, y + 280, 8, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // 5. ল্যাবরেটরি স্লেট ডেস্ক (Science Lab Slate Table)
      const slateGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      slateGrad.addColorStop(0, '#26292e');
      slateGrad.addColorStop(0.5, '#33373e');
      slateGrad.addColorStop(1, '#1e2126');
      ctx.fillStyle = slateGrad;
      ctx.fillRect(x, y, w, h);

      // Slate stone texture grain
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < 400; i++) {
        const sx = x + ((i * 37) % w);
        const sy = y + ((i * 73) % h);
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Beaker bottom circular marks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + 340, y + 180, 38, 0, Math.PI * 2);
      ctx.stroke();

      // Chalk marks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('NaCl + H₂O', x + 140, y + 80);
      ctx.fillText('PHYSICS LAB #2', x + w - 190, y + h - 50);
    }

    ctx.restore();
  };

  // Draw Subtle Glow when resting
  const drawActivePenGlow = (ctx: CanvasRenderingContext2D, pen: PenEntity) => {
    ctx.save();
    ctx.translate(pen.x, pen.y);
    ctx.rotate(pen.angle);

    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 220);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#d97706';
    ctx.shadowBlur = 12 + pulse * 6;

    ctx.beginPath();
    ctx.roundRect(
      -pen.config.length / 2 - 8,
      -pen.config.width / 2 - 6,
      pen.config.length + 16,
      pen.config.width + 12,
      12
    );
    ctx.stroke();
    ctx.restore();
  };

  // Draw Labels "You" / "Computer" Below Pens
  const drawPenLabels = (ctx: CanvasRenderingContext2D, p1: PenEntity, p2: PenEntity) => {
    ctx.save();
    ctx.font = 'bold 15px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';

    // Label for Player 2 / Computer
    if (!p2.isFalling && !p2.isOffTable) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText(gameMode === 'vs-computer' ? 'কম্পিউটার (Computer)' : 'প্লেয়ার ২', p2.x, p2.y + 55);
    }

    // Label for Player 1
    if (!p1.isFalling && !p1.isOffTable) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('আপনি (You)', p1.x, p1.y + 55);
    }

    ctx.restore();
  };

  // CRYSTAL CLEAR TRAJECTORY AIMING HUD
  // Solves: "কলম কোনদিকে মারছি সেটা তো বোঝা যাচ্ছে না।"
  // Features:
  // 1. Unmistakable forward trajectory beam with animated pulsing laser dots!
  // 2. High-visibility target crosshair showing exact strike location
  // 3. Percentage power meter with color shift (Green -> Yellow -> Bright Red)
  // 4. Directional label: "মারার দিক ➔ (এখানে যাবে)"
  // 5. Clean pull-back tension line showing slingshot force
  const drawCrystalClearAimHUD = (
    ctx: CanvasRenderingContext2D,
    start: { x: number; y: number },
    current: { x: number; y: number },
    activePen: PenEntity,
    mode: AimControlMode
  ) => {
    let shootX = 0;
    let shootY = 0;
    let pullX = 0;
    let pullY = 0;

    if (mode === 'slingshot') {
      // User dragged backwards
      pullX = current.x - start.x;
      pullY = current.y - start.y;
      shootX = start.x - current.x;
      shootY = start.y - current.y;
    } else {
      // User dragged forwards (Direct)
      pullX = start.x - current.x;
      pullY = start.y - current.y;
      shootX = current.x - start.x;
      shootY = current.y - start.y;
    }

    const dist = Math.hypot(shootX, shootY);
    if (dist < 8) return;

    const maxPull = 150;
    const clampedDist = Math.min(maxPull, dist);
    const powerRatio = clampedDist / maxPull;

    // Exact forward flight angle
    const forwardAngle = Math.atan2(shootY, shootX);
    // Backward pull angle
    const pullAngle = Math.atan2(pullY, pullX);

    // Color gradient based on power:
    // Low: Emerald (#10b981), Mid: Amber (#f59e0b), High: Vibrant Rose (#f43f5e)
    let powerColor = '#10b981';
    let powerBg = 'rgba(16, 185, 129, 0.2)';
    if (powerRatio > 0.65) {
      powerColor = '#f43f5e';
      powerBg = 'rgba(244, 63, 94, 0.25)';
    } else if (powerRatio > 0.35) {
      powerColor = '#f59e0b';
      powerBg = 'rgba(245, 158, 11, 0.22)';
    }

    const powerPercent = Math.round(powerRatio * 100);

    ctx.save();

    // 1. PULL TENSION TRACK / SLINGSHOT VISUALS
    if (mode === 'slingshot') {
      ctx.save();
      ctx.translate(start.x, start.y);
      ctx.rotate(pullAngle);

      // Elastic pull rope
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(clampedDist, 0);
      ctx.stroke();
      ctx.setLineDash([]);

      // Drag Handle Ring where cursor/finger is
      ctx.fillStyle = powerBg;
      ctx.strokeStyle = powerColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(clampedDist, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Grip notch
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(clampedDist, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 2. FORWARD TRAJECTORY BEAM (CRYSTAL CLEAR DIRECTION)
    ctx.save();
    ctx.translate(start.x, start.y);
    ctx.rotate(forwardAngle);

    // Projected distance the pen will travel
    const flightDist = 55 + powerRatio * 220;

    // Glowing main trajectory line
    ctx.save();
    ctx.shadowColor = powerColor;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = powerColor;
    ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 6]);

    // Animated dash offset
    const animOffset = (Date.now() / 35) % 16;
    ctx.lineDashOffset = -animOffset;

    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(flightDist, 0);
    ctx.stroke();
    ctx.restore();

    // Trajectory Dots (Speed pulse beads)
    const numDots = Math.floor(flightDist / 30);
    for (let i = 1; i <= numDots; i++) {
      const dx = (flightDist / (numDots + 1)) * i;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = powerColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(dx, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // TARGET RETICLE & IMPACT ARROW AT DESTINATION
    ctx.save();
    ctx.translate(flightDist, 0);

    // Animated pulse radius
    const reticlePulse = 1 + 0.15 * Math.sin(Date.now() / 150);
    ctx.strokeStyle = powerColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 14 * reticlePulse, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-7, 0);
    ctx.moveTo(7, 0);
    ctx.lineTo(18, 0);
    ctx.moveTo(0, -18);
    ctx.lineTo(0, -7);
    ctx.moveTo(0, 7);
    ctx.lineTo(0, 18);
    ctx.stroke();

    // Solid forward arrow head
    const headSize = 18;
    ctx.fillStyle = powerColor;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(8 - headSize, -headSize * 0.55);
    ctx.lineTo(8 - headSize * 0.7, 0);
    ctx.lineTo(8 - headSize, headSize * 0.55);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    ctx.restore();

    // 3. POWER & DIRECTION TEXT BADGE (In Bangla, super intuitive!)
    ctx.save();
    // Center point of trajectory
    const midX = start.x + (Math.cos(forwardAngle) * flightDist) * 0.5;
    const midY = start.y + (Math.sin(forwardAngle) * flightDist) * 0.5 - 28;

    ctx.translate(midX, midY);

    const badgeText = `⚡ ${powerPercent}% শক্তি • মারার দিক ➔`;
    ctx.font = 'bold 13px "Hind Siliguri", sans-serif';
    const textMetrics = ctx.measureText(badgeText);
    const badgeW = textMetrics.width + 20;
    const badgeH = 26;

    // Badge pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = powerColor;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 13);
    ctx.fill();
    ctx.stroke();

    // Badge Text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, 0, 0);

    ctx.restore();

    // 4. Pivot point on the pen
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  };

  // AI Aiming Visual Line
  const drawAIAiming = (
    ctx: CanvasRenderingContext2D,
    ai: { startX: number; startY: number; endX: number; endY: number; powerRatio: number }
  ) => {
    ctx.save();
    const dx = ai.endX - ai.startX;
    const dy = ai.endY - ai.startY;
    const angle = Math.atan2(dy, dx);
    const arrowLen = 60 + ai.powerRatio * 90;

    ctx.translate(ai.startX, ai.startY);
    ctx.rotate(angle);

    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 5]);

    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(arrowLen, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow tip
    ctx.beginPath();
    ctx.moveTo(arrowLen + 10, 0);
    ctx.lineTo(arrowLen - 6, -8);
    ctx.lineTo(arrowLen - 6, 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  // Realistic Vector Pen Graphics
  const drawPen = (ctx: CanvasRenderingContext2D, pen: PenEntity) => {
    ctx.save();
    ctx.translate(pen.x, pen.y);

    if (pen.isFalling) {
      ctx.scale(pen.fallScale, pen.fallScale);
      ctx.rotate(pen.angle + pen.fallRotation);
      ctx.globalAlpha = Math.max(0.05, 1 - pen.fallProgress * 0.95);
    } else {
      ctx.rotate(pen.angle);
    }

    const halfL = pen.config.length / 2;
    const halfW = pen.config.width / 2;

    // 1. Realistic Soft Contact Shadow on Wood
    if (!pen.isFalling) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.filter = 'blur(3.5px)';
      ctx.beginPath();
      ctx.roundRect(-halfL + 4, -halfW + 6, pen.config.length, pen.config.width + 1, halfW);
      ctx.fill();
      ctx.restore();
    }

    // 2. Pen Barrel Body (Realistic Cylindrical Light Reflection)
    const barrelGrad = ctx.createLinearGradient(0, -halfW, 0, halfW);
    barrelGrad.addColorStop(0, pen.config.color);
    barrelGrad.addColorStop(0.28, '#ffffff'); // Glare line
    barrelGrad.addColorStop(0.65, pen.config.color);
    barrelGrad.addColorStop(1, '#090d16');

    ctx.fillStyle = barrelGrad;
    ctx.beginPath();
    ctx.roundRect(-halfL + 25, -halfW, pen.config.length - 45, pen.config.width, 3);
    ctx.fill();

    // 3. Name Badge on Pen Body ("You" or "C")
    ctx.save();
    const badgeW = 28;
    const badgeH = pen.config.width - 2;
    ctx.fillStyle = pen.id === 'player1' ? '#ea580c' : '#0284c7';
    ctx.beginPath();
    ctx.roundRect(-20, -badgeH / 2, badgeW, badgeH, 3);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pen.id === 'player1' ? 'You' : 'C', -6, 3);
    ctx.restore();

    // 4. Pen Grip Section
    const gripW = 24;
    const gripX = -halfL + 25;
    ctx.fillStyle = pen.config.secondaryColor;
    ctx.fillRect(gripX, -halfW, gripW, pen.config.width);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 1.2;
    for (let gx = gripX + 4; gx < gripX + gripW; gx += 5) {
      ctx.beginPath();
      ctx.moveTo(gx, -halfW);
      ctx.lineTo(gx, halfW);
      ctx.stroke();
    }

    // 5. Metallic Nib Cone
    const coneGrad = ctx.createLinearGradient(0, -halfW, 0, halfW);
    coneGrad.addColorStop(0, '#f8fafc');
    coneGrad.addColorStop(0.5, '#cbd5e1');
    coneGrad.addColorStop(1, '#64748b');

    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(-halfL + 25, -halfW + 1);
    ctx.lineTo(-halfL, 0);
    ctx.lineTo(-halfL + 25, halfW - 1);
    ctx.closePath();
    ctx.fill();

    // Nib Ballpoint Tip
    ctx.fillStyle = pen.id === 'player1' ? '#0284c7' : '#dc2626';
    ctx.beginPath();
    ctx.arc(-halfL - 1, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 6. Back Stopper / Cap
    const capX = halfL - 20;
    const capGrad = ctx.createLinearGradient(0, -halfW, 0, halfW);
    capGrad.addColorStop(0, pen.config.secondaryColor);
    capGrad.addColorStop(0.35, '#ffffff');
    capGrad.addColorStop(1, pen.config.secondaryColor);

    ctx.fillStyle = capGrad;
    ctx.beginPath();
    ctx.roundRect(capX, -halfW, 20, pen.config.width, [0, halfW, halfW, 0]);
    ctx.fill();

    // 7. Pocket Clip
    ctx.fillStyle = pen.config.accentColor;
    ctx.fillRect(capX - 32, -halfW - 3, 36, 3.5);
    ctx.beginPath();
    ctx.arc(capX - 32, -halfW - 1.5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 bg-stone-950 select-none">
      <canvas
        ref={canvasRef}
        width={virtualWidth}
        height={virtualHeight}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className="w-full h-auto aspect-[105/58] block cursor-crosshair touch-none"
      />

      {/* Floating Interactive Turn Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-700/70 text-stone-200 text-xs sm:text-sm font-medium pointer-events-none shadow-xl">
        {isSimulating ? (
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            কলম ছুটছে...
          </span>
        ) : gameMode === 'vs-computer' && currentTurn === 'player2' ? (
          <span className="text-rose-400 flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            কম্পিউটারের চাল...
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {currentTurn === 'player1' ? 'আপনার চাল: ' : 'প্লেয়ার ২: '}
              {aimMode === 'slingshot'
                ? 'কলমে চেপে পেছনে টানুন (স্লিংশট) — সামনে উজ্জ্বল তীরে কলম ছুটবে!'
                : 'কলমে চেপে যেদিকে মারবেন সেদিকে টানুন (ডিরেক্ট) — লক্ষ্যে কলম ছুটবে!'}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};
