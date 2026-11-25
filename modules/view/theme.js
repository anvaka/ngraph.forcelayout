// theme: everything in the view that depends on whether the background is dark or light.
//
//   createView(scene, {graph, layout, theme: 'light'});
//   view.setTheme(themeOf('#ffffff'));   // 'light'
//
// The view and its modules read their default colors here: nodes and links, the rings and fills
// of highlighted nodes, label text, and the panels modules put on the page (tooltip, search,
// help, the selection box). The style module picks the theme from its `background`, so a page
// that uses it only says which background it wants.

export const THEMES = {
  dark: {
    // The view's own defaults (0xRRGGBBAA)
    nodeColor: 0x90f8fcff,
    linkColor: 0xffffff10,
    // What differs in the view's styles for flagged nodes (see STYLES in index.js)
    styles: {pointedColor: 0xffffffff, selectedColor: 0xffc24bff, ringHalo: 0x000000cc},
    // The style module: nodes without a category, links between categories (0xRRGGBB00), text
    // and lit links, and the rings
    node: '#90f8fc',
    link: 0xffffff00,
    // Opacity of links where they crowd: what reads as much on this background
    linkInk: 0.25,
    text: 0xe6ebf2ff,
    pointedRing: 0xffffffff,
    selectedRing: 0xffc24bff,
    focusedRing: 0x7fe7efff,
    // Labels without the style module
    labelColor: 0xffffffff,
    labelHalo: 0x0c2952e6,
    // Panels on the page
    panel: 'rgba(9,22,44,0.96)',
    panelText: '#e8f1ff',
    panelBorder: 'rgba(255,255,255,0.18)',
    panelShadow: '0 2px 10px rgba(0,0,0,0.45)',
    field: 'rgba(0,0,0,0.35)',
    fieldBorder: 'rgba(255,255,255,0.3)',
    chosen: 'rgba(255,255,255,0.16)',
    box: 'rgba(255,255,255,0.08)',
    boxBorder: 'rgba(255,255,255,0.85)'
  },
  light: {
    nodeColor: 0x0b7a8aff,
    linkColor: 0x1b243330,
    styles: {pointedColor: 0x111827ff, selectedColor: 0xb45309ff, ringHalo: 0xffffffcc},
    node: '#0b7a8a',
    link: 0x1b243300,
    // Dark on white contrasts less than white on dark at the same opacity
    linkInk: 0.35,
    text: 0x1b2433ff,
    pointedRing: 0x111827ff,
    selectedRing: 0xb45309ff,
    focusedRing: 0x0e7490ff,
    labelColor: 0x1b2433ff,
    labelHalo: 0xffffffe6,
    panel: 'rgba(255,255,255,0.97)',
    panelText: '#1b2433',
    panelBorder: 'rgba(27,36,51,0.2)',
    panelShadow: '0 2px 10px rgba(27,36,51,0.18)',
    field: 'rgba(27,36,51,0.04)',
    fieldBorder: 'rgba(27,36,51,0.35)',
    chosen: 'rgba(27,36,51,0.1)',
    box: 'rgba(27,36,51,0.06)',
    boxBorder: 'rgba(27,36,51,0.8)'
  }
};

/** The theme's values; throws on a name that isn't a theme */
export function themeValues(name) {
  if (!Object.prototype.hasOwnProperty.call(THEMES, name)) {
    throw new Error('Unknown theme: ' + name + '. Expected `dark` or `light`');
  }
  return THEMES[name];
}

/**
 * 'light' or 'dark' for a background ('#rrggbb' or '#rgb'): light when black text reads better
 * on it than white text does
 */
export function themeOf(background) {
  return luminance(toRGB(background)) > 0.179 ? 'light' : 'dark';
}

/** Colors of a panel on the page (a tooltip, the search box, the help card) */
export function paintPanel(element, name) {
  let theme = themeValues(name);
  let style = element.style;
  style.background = theme.panel;
  style.color = theme.panelText;
  style.border = '1px solid ' + theme.panelBorder;
  style.boxShadow = theme.panelShadow;
}

export function toRGB(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}

/** WCAG relative luminance of [r, g, b] (0 to 255 each) */
export function luminance(rgb) {
  let [r, g, b] = rgb.map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
