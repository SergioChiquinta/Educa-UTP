
// src/components/LandbotWidget.jsx
import { useEffect } from 'react';

function LandbotWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.async = true;

    script.onload = () => {
      window.myLandbot = new window.Landbot.Livechat({
        configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2957339-A50IKB8O4TD6DUO5/index.json',
      });
    };

    script.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs';
    document.body.appendChild(script);

    // Cleanup al desmontar
    return () => {
      // Elimina Landbot iframe
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        if (iframe.src.includes('landbot')) {
          iframe.remove();
        }
      });

      // Elimina el contenedor del chat si existe
      const landbotContainers = document.querySelectorAll('[id^="landbot"], .Landbot__Button, .LandbotLivechat');
      landbotContainers.forEach(el => el.remove());

      // Limpia variable global
      if (window.myLandbot) {
        window.myLandbot = null;
      }

      // Elimina el script
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}

export default LandbotWidget;
