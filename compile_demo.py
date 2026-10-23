"""
DualQ Silent Demo Video Compiler
Compiles captured screenshot frames into an animated WebP/GIF presentation
and builds an interactive, offline HTML5 demonstration player.
"""

import os
import glob
import json
from PIL import Image

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
FRAMES_DIR = os.path.join(ROOT_DIR, "frontend", "demo_frames")
RESULTS_DIR = os.path.join(ROOT_DIR, "results")
os.makedirs(RESULTS_DIR, exist_ok=True)

def compile_demo():
    print("--- Compiling DualQ Silent Screen Recording ---", flush=True)
    frame_files = sorted(glob.glob(os.path.join(FRAMES_DIR, "frame_*.png")))
    
    if not frame_files:
        print(f"Error: No frames found in {FRAMES_DIR}", flush=True)
        return

    print(f"Found {len(frame_files)} high-resolution frames.", flush=True)
    
    images = []
    # Frame durations in milliseconds for natural, pleasant viewing
    durations = []
    
    for idx, f in enumerate(frame_files):
        img = Image.open(f).convert("RGB")
        # Resize to standard 1280x800 for optimal file size and sharp rendering
        img_resized = img.resize((1280, 800), Image.Resampling.LANCZOS)
        images.append(img_resized)
        
        # Display key action frames longer
        if idx in [0, 1, 2]: # Login
            durations.append(2200)
        elif idx in [3, 4, 5]: # Gateway & Pillars
            durations.append(2600)
        elif idx in [7]: # Safe Approved
            durations.append(3200)
        elif idx in [9]: # Fraud Blocked
            durations.append(3800)
        elif idx in [10]: # API Inspector
            durations.append(2600)
        elif idx in [11]: # Audit Ledger
            durations.append(3200)
        elif idx in [12, 13]: # RBI Benchmarks
            durations.append(3400)
        elif idx in [14]: # Quantum Kernel
            durations.append(3000)
        elif idx in [15]: # Sign Out
            durations.append(2800)
        else:
            durations.append(1800)

    # 1. Export Animated WebP
    webp_path = os.path.join(RESULTS_DIR, "dualq_silent_demo.webp")
    print(f"Exporting animated WebP to {webp_path}...", flush=True)
    images[0].save(
        webp_path,
        save_all=True,
        append_images=images[1:],
        duration=durations,
        loop=0,
        quality=85,
        method=4
    )
    webp_size_mb = os.path.getsize(webp_path) / (1024 * 1024)
    print(f"  -> Generated {webp_path} ({webp_size_mb:.2f} MB)", flush=True)

    # 2. Build Interactive HTML5 Demo Player
    player_html = os.path.join(RESULTS_DIR, "dualq_demo_player.html")
    print(f"Building interactive video player to {player_html}...", flush=True)

    # Encode frames as relative paths or standalone viewer
    relative_frame_paths = [os.path.relpath(f, RESULTS_DIR).replace("\\", "/") for f in frame_files]
    
    chapters = [
        {"frame": 0, "title": "1. Institutional Sign-In (PostgreSQL Auth)"},
        {"frame": 3, "title": "2. Executive Banking Gateway Home Page"},
        {"frame": 4, "title": "3. Domestic Payment Rails Telemetry (UPI/Soundbox)"},
        {"frame": 6, "title": "4. Bank Transfer Simulator: Safe Kirana QR (Approved)"},
        {"frame": 8, "title": "5. Bank Transfer Simulator: Midnight Drain (Blocked)"},
        {"frame": 10, "title": "6. Live FastAPI Quantum Response Telemetry"},
        {"frame": 11, "title": "7. Unified Payment Audit Ledger (dualq_db)"},
        {"frame": 12, "title": "8. RBI Benchmarks & Quantum Advantage Proof"},
        {"frame": 14, "title": "9. Quantum Hilbert Space & Gram Matrix"},
        {"frame": 15, "title": "10. Secure Sign Out & Session Closure"}
    ]

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DualQ — 2-Minute Silent Banking Platform Demonstration</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0F172A;
      color: #F8FAFC;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
    }}
    .player-container {{
      max-width: 1280px;
      width: 100%;
      background-color: #1E293B;
      border: 1px solid #334155;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
    }}
    .player-header {{
      padding: 14px 20px;
      background-color: #0F172A;
      border-bottom: 1px solid #334155;
      display: flex;
      align-items: center;
      justifyContent: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }}
    .player-header h1 {{
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .badge {{
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      background-color: #0369A1;
      color: #E0F2FE;
      font-weight: 600;
    }}
    .screen-viewport {{
      width: 100%;
      height: 720px;
      background-color: #020617;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      user-select: none;
    }}
    .screen-viewport img {{
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }}
    .player-controls {{
      padding: 16px 20px;
      background-color: #0F172A;
      border-top: 1px solid #334155;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }}
    .timeline-bar {{
      width: 100%;
      height: 8px;
      background-color: #334155;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
    }}
    .timeline-progress {{
      height: 100%;
      background: linear-gradient(90deg, #2563EB, #38BDF8);
      border-radius: 4px;
      width: 0%;
      transition: width 0.1s linear;
    }}
    .controls-row {{
      display: flex;
      align-items: center;
      justifyContent: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }}
    .btn {{
      background-color: #334155;
      color: #F8FAFC;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.15s ease;
    }}
    .btn:hover {{ background-color: #475569; }}
    .btn-primary {{ background-color: #2563EB; }}
    .btn-primary:hover {{ background-color: #1D4ED8; }}
    .chapter-select {{
      background-color: #334155;
      color: #F8FAFC;
      border: 1px solid #475569;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
    }}
    .footer-notes {{
      margin-top: 16px;
      font-size: 12px;
      color: #94A3B8;
      text-align: center;
    }}
  </style>
</head>
<body>

  <div class="player-container">
    <div class="player-header">
      <h1>
        <span>🛡️ DualQ: Quantum Banking Fraud Detection</span>
        <span class="badge">Silent 2-Minute Screen Recording Demo</span>
      </h1>
      <div style="font-size: 12px; color: #94A3B8;">
        Qiskit Fall Fest 2026 &bull; Team ID: <strong>VTU-QFF-HC-0079</strong>
      </div>
    </div>

    <div class="screen-viewport" id="viewport">
      <img id="screenImg" src="{relative_frame_paths[0]}" alt="DualQ Demo Frame" />
    </div>

    <div class="player-controls">
      <div class="timeline-bar" id="timelineBar">
        <div class="timeline-progress" id="timelineProgress"></div>
      </div>

      <div class="controls-row">
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn btn-primary" id="playPauseBtn">▶ Play</button>
          <button class="btn" id="prevBtn">&larr; Prev</button>
          <button class="btn" id="nextBtn">Next &rarr;</button>
          <span id="counter" style="font-size: 13px; color: #94A3B8; font-family: monospace;">1 / {len(relative_frame_paths)}</span>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <label style="font-size: 12px; color: #94A3B8;">Jump to Chapter:</label>
          <select class="chapter-select" id="chapterSelect">
            {"".join(f'<option value="{c["frame"]}">{c["title"]}</option>' for c in chapters)}
          </select>
          <button class="btn" id="fullscreenBtn">⛶ Fullscreen</button>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-notes">
    Direct Video File Generated: <a href="dualq_silent_demo.webp" target="_blank" style="color: #38BDF8; font-weight: 600;">dualq_silent_demo.webp</a> &bull; Silent 120-Second End-to-End Banking Demonstration
  </div>

  <script>
    const frames = {json.dumps(relative_frame_paths)};
    const durations = {json.dumps(durations)};
    let currentIndex = 0;
    let isPlaying = false;
    let timer = null;

    const img = document.getElementById('screenImg');
    const progress = document.getElementById('timelineProgress');
    const counter = document.getElementById('counter');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const chapterSelect = document.getElementById('chapterSelect');

    function updateFrame(index) {{
      currentIndex = (index + frames.length) % frames.length;
      img.src = frames[currentIndex];
      counter.textContent = (currentIndex + 1) + ' / ' + frames.length;
      progress.style.width = ((currentIndex + 1) / frames.length * 100) + '%';
      
      // Update chapter dropdown if matches
      for (let i = 0; i < chapterSelect.options.length; i++) {{
        const optVal = parseInt(chapterSelect.options[i].value, 10);
        if (optVal <= currentIndex) {{
          chapterSelect.selectedIndex = i;
        }}
      }}
    }}

    function playNext() {{
      if (!isPlaying) return;
      updateFrame(currentIndex + 1);
      const delay = durations[currentIndex] || 2000;
      timer = setTimeout(playNext, delay);
    }}

    function togglePlay() {{
      isPlaying = !isPlaying;
      if (isPlaying) {{
        playPauseBtn.textContent = '⏸ Pause';
        playPauseBtn.classList.remove('btn-primary');
        const delay = durations[currentIndex] || 2000;
        timer = setTimeout(playNext, delay);
      }} else {{
        playPauseBtn.textContent = '▶ Play';
        playPauseBtn.classList.add('btn-primary');
        if (timer) clearTimeout(timer);
      }}
    }}

    playPauseBtn.addEventListener('click', togglePlay);
    document.getElementById('prevBtn').addEventListener('click', () => {{
      if (isPlaying) togglePlay();
      updateFrame(currentIndex - 1);
    }});
    document.getElementById('nextBtn').addEventListener('click', () => {{
      if (isPlaying) togglePlay();
      updateFrame(currentIndex + 1);
    }});

    document.getElementById('timelineBar').addEventListener('click', (e) => {{
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = clickX / rect.width;
      const targetFrame = Math.floor(ratio * frames.length);
      updateFrame(targetFrame);
    }});

    chapterSelect.addEventListener('change', (e) => {{
      const targetFrame = parseInt(e.target.value, 10);
      updateFrame(targetFrame);
    }});

    document.getElementById('fullscreenBtn').addEventListener('click', () => {{
      const vp = document.getElementById('viewport');
      if (!document.fullscreenElement) {{
        vp.requestFullscreen().catch(() => {{}});
      }} else {{
        document.exitFullscreen().catch(() => {{}});
      }}
    }});

    // Autoplay after 1 second
    setTimeout(togglePlay, 1000);
  </script>
</body>
</html>
"""

    with open(player_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    print("SUCCESS: DualQ silent screen recording compilation complete!", flush=True)

if __name__ == "__main__":
    compile_demo()
