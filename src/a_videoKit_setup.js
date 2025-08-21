//

function videoKit_setup() {
  //
  videoKit = p5videoKit_init(videoKit_config);

  videoKit.save_canvas_handler = save_canvas_handler;

  // import_path in videoKit_config.effects
  // needed to anchored impors to current directory
  videoKit.import_effect_handler = (effMeta) => import('./' + effMeta.import_path);
}

let videoKit_config = {
  // effects for import, will appear at top of the effect menu

  effects: [
    //
    { label: 'maze_spin', import_path: 'effects/maze_spin/eff_maze_spin.js', ui_label: 'maze_spin' },
    { label: 'field_rainstorm', import_path: 'effects/eff_field_rainstorm.js' },
    { label: 'radial_bounce', import_path: 'effects/eff_radial_bounce.js' },
  ],

  // settings for import, will appear in the settings menu

  settings: [
    { label: 'period', import_path: 'settings/period.json' },
    { label: 'field_rainstorm', import_path: 'settings/field_rainstorm.json' },
    { label: 'radial_bounce', import_path: 'settings/radial_bounce.json' },
    { label: 'radial_bounce_1x4', import_path: 'settings/radial_bounce_1x4.json' },
  ],

  videos: [{ label: 'P2TP', import_path: 'videos/JohnHenry-P2TP-WEB_ShortVersion.mp4' }],
};
