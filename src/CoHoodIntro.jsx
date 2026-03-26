import { useEffect, useRef } from "react";

export default function CoHoodIntro({ onFinish }) {
  const scRef = useRef(null);
  const cvRef = useRef(null);

  useEffect(() => {
    const sc = scRef.current;
    const cv = cvRef.current;
    if (!sc || !cv) return;

    const ctx = cv.getContext("2d");
    const logoWrap = document.getElementById("cohood-logo-wrap");
    const tagline = document.getElementById("cohood-tagline");
    const hint = document.getElementById("cohood-hint");

    let W, H, t = 0, phase = "idle", pt = 0;
    const smokes = [], sparks = [];
    let rafId;

    // --- Typewriter state ---
    const lines = [
      "This mirror doesn't just show you —",
      "it reflects the value you bring,",
      "the bonds you build, and your mark",
      "on the neighborhood."
    ];
    let twStartTime = null;
    let twVisible = false;
    const CHAR_DELAY = 38;
    const LINE_GAP = 30;

    function drawTypewriter(ts) {
      if (!twVisible || !twStartTime) return;
      const mx = W / 2;
      const my = H * 0.48;
      const mh = 130;
      const baseY = my + mh / 2 - 30;
      const elapsed = ts - twStartTime;
      let charsToShow = Math.floor(elapsed / CHAR_DELAY);

      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "18px Georgia";

      let charCount = 0;
      for (let li = 0; li < lines.length; li++) {
        const line = lines[li];
        const lineStartChar = charCount;
        if (charsToShow <= lineStartChar) break;

        const charsInLine = Math.min(charsToShow - lineStartChar, line.length);
        const visibleText = line.slice(0, charsInLine);
        const lineProgress = charsInLine / line.length;
        const alpha = Math.min(1, lineProgress * 2) * 0.75;

        // drift from mirror center down to final position
        const lineY = baseY + li * LINE_GAP;
        const driftY = my + (lineY - my) * Math.min(1, lineProgress * 1.5);

        ctx.fillStyle = `rgba(220,210,240,${alpha})`;
        ctx.fillText(visibleText, mx, driftY);

        charCount += line.length;
      }
      ctx.restore();
    }

    function resize() {
      W = cv.width = sc.offsetWidth;
      H = cv.height = sc.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function Smoke(x, y, r, speed, alpha, drift) {
      this.x = x; this.y = y; this.r = r; this.speed = speed;
      this.alpha = alpha; this.drift = drift; this.age = 0;
      this.maxAge = 220 + Math.random() * 120;
      this.dx = (Math.random() - 0.5) * 0.3;
    }

    function initSmokes() {
      smokes.length = 0;
      for (let i = 0; i < 28; i++) {
        smokes.push(new Smoke(
          Math.random() * W, H * 0.3 + Math.random() * H * 0.7,
          60 + Math.random() * 120, 0.2 + Math.random() * 0.4,
          0.03 + Math.random() * 0.07, (Math.random() - 0.5) * 0.8
        ));
      }
    }
    initSmokes();

    function spawnSmoke() {
      if (smokes.length < 35) {
        smokes.push(new Smoke(
          Math.random() * W, H + 20,
          50 + Math.random() * 100, 0.25 + Math.random() * 0.5,
          0.04 + Math.random() * 0.06, (Math.random() - 0.5) * 0.8
        ));
      }
    }

    function drawSmoke() {
      for (let i = smokes.length - 1; i >= 0; i--) {
        const s = smokes[i];
        s.age++; s.y -= s.speed; s.x += s.drift + s.dx; s.r += 0.15;
        const life = s.age / s.maxAge;
        const a = s.alpha * Math.sin(life * Math.PI) * (phase === "idle" ? 1 : Math.max(0, 1 - (pt - 1500) / 1000));
        if (a <= 0 || s.age > s.maxAge) { smokes.splice(i, 1); continue; }
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        const c1 = phase === "idle" ? `rgba(90,75,110,${a})` : `rgba(200,180,255,${a * 0.6})`;
        grd.addColorStop(0, c1);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function drawMirror(glowAmt) {
      if (phase === "flash" || phase === "done") return;
      const mx = W / 2, my = H * 0.48;
      const mw = 88, mh = 130;
      ctx.save();
      ctx.shadowColor = `rgba(180,160,220,${0.15 + glowAmt * 0.6})`;
      ctx.shadowBlur = 30 + glowAmt * 60;
      const frameW = mw + 22, frameH = mh + 28;
      ctx.strokeStyle = `rgba(${180 + glowAmt * 60},${160 + glowAmt * 40},${200 + glowAmt * 30},${0.55 + glowAmt * 0.4})`;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(mx, my, frameW / 2, frameH / 2, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = `rgba(${160 + glowAmt * 80},${140 + glowAmt * 60},${180 + glowAmt * 40},${0.3 + glowAmt * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(mx, my, frameW / 2 + 6, frameH / 2 + 7, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = `rgba(200,180,230,${0.4 + glowAmt * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(mx - frameW / 2 + 4, my - frameH / 2 + 8); ctx.bezierCurveTo(mx - frameW / 2 - 6, my - frameH / 2 - 10, mx - 14, my - frameH / 2 - 18, mx, my - frameH / 2 - 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mx + frameW / 2 - 4, my - frameH / 2 + 8); ctx.bezierCurveTo(mx + frameW / 2 + 6, my - frameH / 2 - 10, mx + 14, my - frameH / 2 - 18, mx, my - frameH / 2 - 20); ctx.stroke();
      ctx.fillStyle = `rgba(220,200,255,${0.5 + glowAmt * 0.4})`;
      ctx.beginPath(); ctx.arc(mx, my - frameH / 2 - 20, 4, 0, Math.PI * 2); ctx.fill();
      for (let side of [-1, 1]) {
        ctx.strokeStyle = `rgba(180,160,210,${0.3 + glowAmt * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(mx + side * (frameW / 2 + 6), my - 20); ctx.bezierCurveTo(mx + side * (frameW / 2 + 14), my - 10, mx + side * (frameW / 2 + 14), my + 10, mx + side * (frameW / 2 + 6), my + 20); ctx.stroke();
        ctx.fillStyle = `rgba(200,180,240,${0.35 + glowAmt * 0.3})`;
        for (let dy of [-30, 0, 30]) { ctx.beginPath(); ctx.arc(mx + side * (frameW / 2 + 4), my + dy, 2, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.strokeStyle = `rgba(180,160,210,${0.35 + glowAmt * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(mx - 16, my + frameH / 2 + 4); ctx.bezierCurveTo(mx - 8, my + frameH / 2 + 16, mx + 8, my + frameH / 2 + 16, mx + 16, my + frameH / 2 + 4); ctx.stroke();
      const grd = ctx.createRadialGradient(mx - 15, my - 20, 5, mx, my, mh / 1.5);
      const ga = 0.12 + glowAmt * 0.55;
      grd.addColorStop(0, `rgba(200,190,255,${ga + 0.15})`);
      grd.addColorStop(0.4, `rgba(120,100,180,${ga})`);
      grd.addColorStop(1, `rgba(30,20,50,${ga * 0.8})`);
      ctx.fillStyle = grd; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.ellipse(mx, my, mw / 2, mh / 2, 0, 0, Math.PI * 2); ctx.fill();
      if (glowAmt > 0) {
        const ig = ctx.createRadialGradient(mx, my, 0, mx, my, mw / 2);
        ig.addColorStop(0, `rgba(255,240,255,${glowAmt * 0.9})`);
        ig.addColorStop(0.5, `rgba(200,160,255,${glowAmt * 0.5})`);
        ig.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(mx, my, mw / 2, mh / 2, 0, 0, Math.PI * 2); ctx.fill();
      }
      if (phase === "idle" || phase === "glow") {
        ctx.fillStyle = `rgba(220,210,240,${0.4 + glowAmt * 0.3})`;
        ctx.font = (9 + glowAmt * 2) + "px Georgia";
        ctx.textAlign = "center";
        ctx.fillText("know your", mx, my - 8);
        ctx.fillText("neighbors", mx, my + 8);
      }
      ctx.strokeStyle = `rgba(160,140,190,${0.4 + glowAmt * 0.2})`;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(mx, my + mh / 2 + 14); ctx.lineTo(mx, my + mh / 2 + 36); ctx.stroke();
      ctx.strokeStyle = `rgba(160,140,190,${0.3 + glowAmt * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mx - 22, my + mh / 2 + 36); ctx.bezierCurveTo(mx - 10, my + mh / 2 + 32, mx + 10, my + mh / 2 + 32, mx + 22, my + mh / 2 + 36); ctx.stroke();
      ctx.restore();
    }

    function drawRays(progress) {
      const mx = W / 2, my = H * 0.48;
      ctx.save();
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const len = (160 + Math.random() * 80) * progress;
        const a = (0.6 - progress * 0.5) * progress;
        ctx.strokeStyle = `rgba(255,240,255,${a})`;
        ctx.lineWidth = 0.5 + Math.random();
        ctx.beginPath();
        ctx.moveTo(mx + Math.cos(angle) * 44, my + Math.sin(angle) * 65);
        ctx.lineTo(mx + Math.cos(angle) * len, my + Math.sin(angle) * len);
        ctx.stroke();
      }
      ctx.restore();
    }

    function spawnSparks() {
      const mx = W / 2, my = H * 0.48;
      for (let i = 0; i < 80; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 7;
        sparks.push({ x: mx, y: my, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 1, life: 1, decay: 0.016 + Math.random() * 0.02, size: 1 + Math.random() * 2.5, hue: 260 + Math.random() * 60 });
      }
    }

    function drawSparks() {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.fillStyle = `hsla(${s.hue},90%,85%,${s.life})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2); ctx.fill();
      }
    }

    let flashAlpha = 0, glowAmt = 0, logoOpacity = 0, rayProg = 0, sparksSpawned = false;

    function loop(ts) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#060408"; ctx.fillRect(0, 0, W, H);
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
      if (Math.random() < 0.08) spawnSmoke();
      drawSmoke();

      if (phase === "idle") {
        glowAmt = 0; drawMirror(0);
      } else if (phase === "glow") {
        const elapsed = ts - pt;
        glowAmt = Math.min(1, elapsed / 900);
        drawMirror(glowAmt);
        if (elapsed > 600) { rayProg = Math.min(1, (elapsed - 600) / 400); drawRays(rayProg); }
        if (elapsed > 900 && !sparksSpawned) { spawnSparks(); sparksSpawned = true; }
        if (elapsed > 1000) { phase = "flash"; pt = ts; }
      } else if (phase === "flash") {
        const elapsed = ts - pt;
        drawSparks();
        if (elapsed < 120) {
          flashAlpha = elapsed / 120;
        } else if (elapsed < 350) {
          flashAlpha = 1 - (elapsed - 120) / 230;
          if (elapsed > 150) {
            logoOpacity = Math.min(1, (elapsed - 150) / 200);
            logoWrap.style.opacity = logoOpacity;
            logoWrap.style.top = "50%";
            logoWrap.style.transform = "translate(-50%,-50%)";
            logoWrap.style.transition = "none";
          }
        } else {
          flashAlpha = 0;
          if (elapsed > 600) tagline.style.opacity = "1";
          if (elapsed > 1200) { phase = "rise"; pt = ts; }
        }
        ctx.fillStyle = `rgba(255,252,255,${flashAlpha})`; ctx.fillRect(0, 0, W, H);
      } else if (phase === "rise") {
        drawSparks();
        const elapsed = ts - pt;
        const prog = Math.min(1, elapsed / 900);
        const ease = 1 - Math.pow(1 - prog, 3);
        const curTop = H / 2 + (72 - H / 2) * ease;
        logoWrap.style.top = curTop + "px";
        logoWrap.style.transform = "translate(-50%, 0)";
        logoWrap.style.transition = "none";
        if (elapsed > 1000) {
          phase = "done";
          pt = ts;
          twVisible = true;
          twStartTime = ts;
          hint.style.display = "none";
        }
      } else if (phase === "done") {
        drawSparks();
        drawTypewriter(ts);

        const totalChars = lines.reduce((s, l) => s + l.length, 0);
        const elapsed = ts - pt;
        const allDone = elapsed > totalChars * CHAR_DELAY + 800;
        if (allDone && hint.style.display === "none") {
          hint.textContent = "tap to continue";
          hint.style.display = "block";
        }
      }

      t++;
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    function onTap() {
      if (phase === "idle") {
        phase = "glow"; pt = performance.now(); sparksSpawned = false;
        hint.style.display = "none";
      } else if (phase === "done") {
        if (typeof onFinish === "function") onFinish();
      }
    }

    sc.addEventListener("click", onTap);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      sc.removeEventListener("click", onTap);
    };
  }, [onFinish]);

  return (
    <div
      ref={scRef}
      style={{ width: "100%", height: "100vh", background: "#080608", position: "relative", overflow: "hidden", cursor: "pointer", userSelect: "none" }}
    >
      <canvas ref={cvRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div id="cohood-hint" style={{ position: "absolute", bottom: 20, width: "100%", textAlign: "center", color: "rgba(200,180,220,0.45)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Georgia,serif", animation: "fp 2.5s ease-in-out infinite" }}>
          tap
        </div>
        <div id="cohood-logo-wrap" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0, textAlign: "center", transition: "none", pointerEvents: "none" }}>
          <img src="/CoHoodLogo.png" alt="CoHood" style={{ width: 260, maxWidth: "80vw", height: "auto", filter: "brightness(0) invert(1)" }} />
          <div id="cohood-tagline" style={{ color: "rgba(220,210,240,0.8)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Georgia,serif", marginTop: 8, opacity: 0, transition: "opacity 0.8s" }}>
            The Social Operating System
          </div>
        </div>
      </div>
      <style>{`@keyframes fp{0%,100%{opacity:0.3}50%{opacity:0.8}}`}</style>
    </div>
  );
}
