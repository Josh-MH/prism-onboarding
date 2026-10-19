import {mkdir, writeFile} from 'node:fs/promises';

const out = new URL('./assets/', import.meta.url);
await mkdir(out, {recursive:true});

const marks = {
  display: `<g opacity=".98">
    <text x="-238" y="-116" fill="#b8d0ca" font-family="Arial,sans-serif" font-size="13" letter-spacing="3">GOOD MORNING</text>
    <text x="-238" y="-38" fill="#f0f5ec" font-family="Georgia,serif" font-size="70">09:41</text>
    <path d="M-238,-16 H24" stroke="#637e7d" stroke-width="1"/>
    <rect x="-238" y="8" width="262" height="85" rx="10" fill="#1c3036" stroke="#68837e" stroke-opacity=".45"/>
    <rect x="-216" y="32" width="122" height="6" rx="3" fill="#b1d5ca" opacity=".75"/>
    <rect x="-216" y="51" width="193" height="5" rx="3" fill="#8ea5a1" opacity=".48"/>
    <rect x="-216" y="67" width="160" height="5" rx="3" fill="#8ea5a1" opacity=".34"/>
    <circle cx="170" cy="-66" r="50" fill="url(#moon)"/>
    <path d="M108,40 H231 M108,61 H205 M108,82 H222" stroke="#9ebbb4" stroke-width="5" stroke-linecap="round" opacity=".6"/>
  </g>`,
  agent: `<g>
    <circle cx="0" cy="-29" r="99" fill="url(#aura)" opacity=".4"/>
    <circle cx="0" cy="-29" r="62" fill="none" stroke="#90e4ce" stroke-width="1" opacity=".65"/>
    <circle cx="0" cy="-29" r="47" fill="url(#orb)"/>
    <path d="M-166,-68 C-99,-68 -109,-29 -66,-29 M66,-29 C104,-29 98,-68 166,-68 M-166,20 C-93,20 -114,-29 -66,-29 M66,-29 C105,-29 96,20 166,20" fill="none" stroke="#8adac6" stroke-width="2" opacity=".72"/>
    <g fill="#b6f1dd"><circle cx="-166" cy="-68" r="5"/><circle cx="166" cy="-68" r="5"/><circle cx="-166" cy="20" r="5"/><circle cx="166" cy="20" r="5"/></g>
    <rect x="-214" y="69" width="428" height="7" rx="3" fill="#aec9bf" opacity=".19"/>
    <rect x="-80" y="69" width="160" height="7" rx="3" fill="#a7f3d8" opacity=".8"/>
  </g>`,
  pair: `<g>
    <rect x="-180" y="-116" width="360" height="193" rx="14" fill="#11272c" stroke="#a7e2ce" stroke-opacity=".5"/>
    <path d="M-144,-76 H-26 M-144,-57 H95" stroke="#afcac0" stroke-width="5" stroke-linecap="round" opacity=".5"/>
    <g fill="#d7f5e8"><rect x="-144" y="-3" width="43" height="48" rx="7"/><rect x="-90" y="-3" width="43" height="48" rx="7"/><rect x="-36" y="-3" width="43" height="48" rx="7"/><rect x="32" y="-3" width="43" height="48" rx="7"/><rect x="86" y="-3" width="43" height="48" rx="7"/></g>
    <circle cx="145" cy="-91" r="6" fill="#a0e4cd"/>
  </g>`,
  publish: `<g>
    <rect x="-230" y="-116" width="298" height="207" rx="12" fill="#1b3236" stroke="#71958b" stroke-opacity=".45"/>
    <text x="-206" y="-73" fill="#dcece4" font-family="Georgia,serif" font-size="32">Today, in view.</text>
    <path d="M-205,-44 H37 M-205,-28 H-17" stroke="#99aea7" stroke-width="5" stroke-linecap="round" opacity=".55"/>
    <rect x="-205" y="-3" width="245" height="70" rx="8" fill="#263f40"/>
    <path d="M-184,47 L-133,18 L-82,34 L-30,6 L17,22" fill="none" stroke="#a2e8ce" stroke-width="4"/>
    <rect x="87" y="-116" width="140" height="94" rx="10" fill="#285350" stroke="#9bdac6" stroke-opacity=".5"/>
    <circle cx="157" cy="-70" r="27" fill="url(#moon)"/>
    <rect x="87" y="-11" width="140" height="102" rx="10" fill="#26383d" stroke="#6e8984" stroke-opacity=".45"/>
    <path d="M106,22 H189 M106,40 H204 M106,58 H171" stroke="#a9c3b8" stroke-width="5" stroke-linecap="round" opacity=".6"/>
  </g>`,
  voice: `<g>
    <circle cx="0" cy="-34" r="104" fill="url(#aura)" opacity=".38"/>
    <circle cx="0" cy="-34" r="86" fill="none" stroke="#8fe4cb" stroke-opacity=".4"/>
    <circle cx="0" cy="-34" r="64" fill="none" stroke="#a7edcf" stroke-opacity=".8" stroke-width="2"/>
    <circle cx="0" cy="-34" r="36" fill="url(#orb)"/>
    <path d="M-183,-31 h25 l11,-34 17,69 16,-89 18,102 17,-67 10,19 h131 l14,-38 15,76 18,-87 16,49 h48" fill="none" stroke="#c0f8de" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
  </g>`
};

function svg(scene, portrait) {
  const width=portrait?900:1600, height=portrait?1600:900;
  const cx=portrait?450:1090, cy=portrait?500:434, scale=portrait?1:1.16;
  const motif=marks[scene];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Prism architectural scene">
  <defs>
    <radialGradient id="back"><stop stop-color="#16372f"/><stop offset=".48" stop-color="#0a1b1d"/><stop offset="1" stop-color="#060b10"/></radialGradient>
    <radialGradient id="aura"><stop stop-color="#81f3cc" stop-opacity=".8"/><stop offset="1" stop-color="#81f3cc" stop-opacity="0"/></radialGradient>
    <linearGradient id="wall" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#203a3b"/><stop offset=".55" stop-color="#101f25"/><stop offset="1" stop-color="#0a151b"/></linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2a4140"/><stop offset="1" stop-color="#071116"/></linearGradient>
    <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#132c31"/><stop offset="1" stop-color="#081b23"/></linearGradient>
    <radialGradient id="moon"><stop stop-color="#f1f1c8"/><stop offset=".55" stop-color="#acd2be"/><stop offset="1" stop-color="#65adab" stop-opacity=".35"/></radialGradient>
    <radialGradient id="orb"><stop stop-color="#e8ffe8"/><stop offset=".36" stop-color="#9be5c9"/><stop offset="1" stop-color="#2d807f"/></radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="28"/></filter>
    <filter id="shadow"><feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#000" flood-opacity=".55"/></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="#060b10"/>
  <rect width="${width}" height="${height}" fill="url(#back)" opacity=".86"/>
  <circle cx="${cx+170}" cy="${cy-120}" r="320" fill="#49aa91" opacity=".12" filter="url(#blur)"/>
  <path d="M0 ${height*.75} H${width}" stroke="#60aa98" stroke-opacity=".12"/>
  <g transform="translate(${cx} ${cy}) scale(${scale})" filter="url(#shadow)">
    <path d="M-465,-285 L360,-285 L465,-180 L465,198 L-465,198 Z" fill="url(#wall)" stroke="#759a8c" stroke-opacity=".42" stroke-width="2"/>
    <path d="M-465,198 L465,198 L620,362 L-620,362 Z" fill="url(#floor)" stroke="#759a8c" stroke-opacity=".28" stroke-width="2"/>
    <path d="M-465,-285 L-465,198 L-620,362 M360,-285 L465,-180 M465,198 L620,362" fill="none" stroke="#9ac5ae" stroke-opacity=".22" stroke-width="2"/>
    <path d="M-415,-250 V156 M-365,-250 V156 M377,-145 V168 M420,-116 V183" stroke="#92c4ab" stroke-opacity=".1" stroke-width="2"/>
    <path d="M-620,362 H620 M-456,205 H455" stroke="#a5d5bf" stroke-opacity=".14" stroke-width="2"/>
    <path d="M-210,198 L-272,362 M210,198 L272,362" stroke="#c1dbca" stroke-opacity=".08" stroke-width="2"/>
    <rect x="-303" y="-181" width="606" height="326" rx="16" fill="#020608" stroke="#b3d5c4" stroke-opacity=".62" stroke-width="3"/>
    <rect x="-291" y="-169" width="582" height="302" rx="8" fill="url(#screen)"/>
    <path d="M-274,-150 H270" stroke="#e5f7e4" stroke-opacity=".12"/>
    ${motif}
    <path d="M-20,145 H20 L34,187 H-34 Z" fill="#142026" stroke="#768f86" stroke-opacity=".28"/>
    <path d="M-123,187 H123 L139,199 H-139 Z" fill="#111d23"/>
    <path d="M-440,199 H440" stroke="#b6d9c3" stroke-opacity=".17" stroke-width="3"/>
    <path d="M-402,245 H402" stroke="#8ab5a1" stroke-opacity=".1" stroke-width="2"/>
  </g>
  <circle cx="${cx}" cy="${cy+380*scale}" r="360" fill="#4ab193" opacity=".08" filter="url(#blur)"/>
  </svg>`;
}
for (const scene of Object.keys(marks)) {
  await writeFile(new URL(`${scene}.svg`,out),svg(scene,false));
  await writeFile(new URL(`${scene}-mobile.svg`,out),svg(scene,true));
}
console.log('Created ten Prism world stills.');
