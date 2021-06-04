import { spline } from "https://cdn.skypack.dev/@georgedoescode/spline@1.0.1";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@2.4.0";
import gsap from "https://cdn.skypack.dev/gsap";

const morphSpeed = 40;

const simplex = new SimplexNoise();
const points = createPoints();

gsap.fromTo(
  ".blob",
  {
    transformOrigin: "100px 100px",
    attr: { fill: "#fff" },
    scale: 0
  },
  {
    delay: 0.1,
    scale: (i) => 1 - i * 0.35,
    duration: (i) => 0.2 + i * 0.1
  }
);

function createPoints() {
  const points = [];
  const numPoints = 7; // maybe don't go over 8
  const angleStep = (Math.PI * 2) / numPoints;
  const rad = 75;

  for (let i = 1; i <= numPoints; i++) {
    const x = 100 + Math.cos(i * angleStep) * rad;
    const y = 100 + Math.sin(i * angleStep) * rad;

    points.push({
      x: x,
      y: y,
      originX: x,
      originY: y,
      noiseOffsetX: gsap.utils.random(0, 99),
      noiseOffsetY: gsap.utils.random(0, 99)
    });
  }

  return points;
}

function animate() {
  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    const nX = simplex.noise2D(pt.noiseOffsetX, pt.noiseOffsetX);
    const nY = simplex.noise2D(pt.noiseOffsetY, pt.noiseOffsetY);

    pt.x = gsap.utils.mapRange(-1, 1, pt.originX - 14, pt.originX + 14, nX);
    pt.y = gsap.utils.mapRange(-1, 1, pt.originY - 14, pt.originY + 14, nY);

    pt.noiseOffsetX = pt.noiseOffsetY += morphSpeed / 10000;
  }

  gsap.to(".blob", {
    duration: (i) => i * 0.08,
    attr: { d: spline(points, 1, true) }
  });
}

gsap.ticker.add(animate);

window.onmousemove = (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  gsap.to(".blob", {
    duration: (i) => 0.3 + i * 0.5,
    x: -20 + x * 40,
    y: -20 + y * 40
  });
};
