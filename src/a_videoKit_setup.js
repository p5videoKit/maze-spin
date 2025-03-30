//

function videoKit_setup() {
  //
  videoKit = p5videoKit_init(videoKit_config);

  videoKit.save_canvas_handler = save_canvas_handler;

  // import_path in videoKit_config.effects  need to anchored to current directory
  videoKit.import_effect_handler = (effMeta) => import('./' + effMeta.import_path);
}

let videoKit_config = {
  // effects for import, will appear at top of the effect menu

  effects: [
    //
    { label: 'maze_spin', import_path: 'effects/maze_spin/eff_maze_spin.js', ui_label: 'maze_spin' },
  ],

  // settings for import, will appear in the settings menu

  settings: [{ label: 'videoKit', import_path: 'settings/videoKit.json' }],
};
