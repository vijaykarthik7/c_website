/**
 * EVOLUTE — Autonomous AI Cyborg Website Logic & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const robotStage = document.getElementById('robotStage');
  const robotVisual = document.getElementById('robotVisual');
  const robotHeadLayer = document.getElementById('robotHeadLayer');
  const headCenter = document.getElementById('headCenter');
  const headLeft = document.getElementById('headLeft');
  const headRight = document.getElementById('headRight');
  const visorLaser = document.getElementById('visorLaser');
  const ambientGlow = document.getElementById('ambientGlow');

  const readMoreBtn = document.getElementById('readMoreBtn');
  const playBtn = document.getElementById('playBtn');
  const tryNowBtn = document.getElementById('tryNowBtn');
  const demoModal = document.getElementById('demoModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const chipBtns = document.querySelectorAll('.chip-btn');
  const navLinks = document.querySelectorAll('.nav-link');

  // =========================================================================
  // 1. Web Audio Synthesizer (Cybernetic Micro-Haptics & SFX)
  // =========================================================================
  const AudioEngine = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    },
    playBeep(freq = 880, type = 'sine', duration = 0.08, gainVal = 0.04) {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio might be blocked until user gesture, safe to ignore
      }
    },
    playScanHum() {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(380, this.ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.38);
      } catch (e) {}
    }
  };

  // =========================================================================
  // 2. Head-Only 3D Rotation (Body Fixed, Smooth Up/Down & Left/Right)
  // =========================================================================
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0, targetRotZ = 0, targetShiftY = 0;
  let currentRotX = 0, currentRotY = 0, currentRotZ = 0, currentShiftY = 0;
  let currentAngle = 'center';

  function setHeadAngle(angle) {
    if (angle === currentAngle) return;
    currentAngle = angle;

    if (headCenter) headCenter.classList.toggle('active', angle === 'center');
    if (headLeft) headLeft.classList.toggle('active', angle === 'left');
    if (headRight) headRight.classList.toggle('active', angle === 'right');
  }

  window.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    // Normalized coordinates from -1 (left / top) to +1 (right / bottom)
    mouseX = (e.clientX / innerWidth) * 2 - 1;
    mouseY = (e.clientY / innerHeight) * 2 - 1;

    // Pitch: Up / Down rotation (looks up when mouse is high, nods down when mouse is low)
    targetRotX = -mouseY * 15;
    
    // Yaw: Left / Right rotation
    targetRotY = mouseX * 18;
    
    // Roll: Subtle organic tilt
    targetRotZ = mouseX * 3;

    // Subtle natural vertical pivot compression
    targetShiftY = -mouseY * 3;

    // Multi-angle head asset transition with smooth hysteresis
    if (currentAngle === 'center') {
      if (mouseX < -0.22) {
        setHeadAngle('left');
      } else if (mouseX > 0.22) {
        setHeadAngle('right');
      }
    } else if (currentAngle === 'left') {
      if (mouseX > -0.10) {
        setHeadAngle(mouseX > 0.22 ? 'right' : 'center');
      }
    } else if (currentAngle === 'right') {
      if (mouseX < 0.10) {
        setHeadAngle(mouseX < -0.22 ? 'left' : 'center');
      }
    }

    // Atmospheric ambient glow follows the robot's gaze
    if (ambientGlow) {
      ambientGlow.style.transform = `translate(calc(-50% + ${mouseX * 45}px), calc(-50% + ${mouseY * 35}px))`;
    }
  });

  // Smooth 60fps/120fps physics loop targeting ONLY the head layer
  function renderHeadMotion() {
    // Silky smooth exponential damping (LERP factor 0.08)
    currentRotX += (targetRotX - currentRotX) * 0.08;
    currentRotY += (targetRotY - currentRotY) * 0.08;
    currentRotZ += (targetRotZ - currentRotZ) * 0.08;
    currentShiftY += (targetShiftY - currentShiftY) * 0.08;

    if (robotHeadLayer) {
      robotHeadLayer.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) rotateZ(${currentRotZ.toFixed(2)}deg) translateY(${currentShiftY.toFixed(2)}px)`;
    }

    requestAnimationFrame(renderHeadMotion);
  }
  renderHeadMotion();

  function triggerVisorScan() {
    if (visorLaser) {
      visorLaser.style.opacity = '1';
      visorLaser.style.transform = 'scaleX(1.4)';
      setTimeout(() => {
        visorLaser.style.opacity = '0';
        visorLaser.style.transform = 'scaleX(1)';
      }, 450);
    }
  }

  // Click on robot triggers scan pulse
  if (robotVisual) {
    robotVisual.addEventListener('click', () => {
      AudioEngine.playScanHum();
      triggerVisorScan();
    });
  }

  // =========================================================================
  // 4. Interactive Live Terminal (Evolute Cognitive Engine)
  // =========================================================================
  const botResponses = {
    telemetry: "[EVOLUTE]: Telemetry: Core temp 34.2°C. Synaptic latency 1.42ms. 42 Actuators calibrated. All subsystems nominal.",
    accuracy: "[EVOLUTE]: 98.4% benchmark achieved via quantum-synaptic real-time sensory pruning and on-device neuromorphic clustering.",
    visor: "[EVOLUTE]: Engaging high-bandwidth dual-slit LiDAR scanner. Ambient optical grid mapped: 14 target points identified.",
    default: "[EVOLUTE]: Directive acknowledged. Autonomous cognitive pipeline synthesized. Ready for execution."
  };

  function addTerminalLine(text, type = 'bot') {
    if (!terminalOutput) return;
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    AudioEngine.playBeep(type === 'user' ? 620 : 940, 'sine', 0.05, 0.02);
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = terminalInput.value.trim();
      if (!query) return;

      addTerminalLine(`> ${query}`, 'user');
      terminalInput.value = '';

      setTimeout(() => {
        const lower = query.toLowerCase();
        let reply = botResponses.default;
        if (lower.includes('telemetry') || lower.includes('vital') || lower.includes('status')) {
          reply = botResponses.telemetry;
        } else if (lower.includes('98') || lower.includes('accuracy') || lower.includes('benchmark')) {
          reply = botResponses.accuracy;
        } else if (lower.includes('visor') || lower.includes('scan') || lower.includes('radar')) {
          reply = botResponses.visor;
          triggerVisorScan();
        }
        addTerminalLine(reply, 'bot');
      }, 400);
    });
  }

  // Prompt chips
  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt && terminalInput) {
        terminalInput.value = prompt;
        terminalForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  // =========================================================================
  // 5. Interactive Demo Modal
  // =========================================================================
  function openModal() {
    AudioEngine.playScanHum();
    if (demoModal) demoModal.classList.add('open');
  }

  function closeModal() {
    if (demoModal) demoModal.classList.remove('open');
  }

  if (playBtn) playBtn.addEventListener('click', openModal);
  if (tryNowBtn) tryNowBtn.addEventListener('click', openModal);
  if (readMoreBtn) {
    readMoreBtn.addEventListener('click', () => {
      const featuresSection = document.getElementById('features');
      if (featuresSection) featuresSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeModal();
    });
  }

  // =========================================================================
  // 6. Navigation Link Highlighting on Scroll
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-nav') === current) {
        link.classList.add('active');
      }
    });
  });

  // Gadget Pod click interaction
  const gadgetPod = document.getElementById('gadgetPod');
  if (gadgetPod) {
    gadgetPod.addEventListener('click', () => {
      AudioEngine.playBeep(1200, 'sine', 0.1);
      triggerVisorScan();
    });
  }

  // Newsletter form submission
  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('subEmail');
      if (emailInput && emailInput.value) {
        AudioEngine.playBeep(880, 'sine', 0.1);
        alert(`Access granted for ${emailInput.value}. Welcome to Evolute.`);
        emailInput.value = '';
      }
    });
  }
});
