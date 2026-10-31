# Anime chat companion

The personalized anime companion is based on the portfolio owner's supplied photos. The animated WebP at `frontend/public/ai-companion.webp` contains a four-pose ping-pong loop: relaxed idle, lifting the orb, a brighter energy action, and a settle-back pose. CSS adds subtle floating/swaying, moving energy rings, ambient glow and particles; the motion becomes stronger while the AI is streaming.

The component checks `prefers-reduced-motion` and loads `ai-companion-static.webp` for users who request reduced motion. No paid animation service or 3D runtime is needed.

To adjust size and supporting effects, edit the `chat-companion` styles and `companion-*` keyframes near the end of `frontend/src/App.css`.
