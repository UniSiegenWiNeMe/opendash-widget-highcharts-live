import pkg from '../package.json';

import widgetController from './widget/widget.controller.js';
import widgetTemplate from './widget/widget.template.html';
import './widget/widget.scss';

import settingsController from './settings/settings.controller.js';
import settingsTemplate from './settings/settings.template.html';
import './settings/settings.scss';

import defaultPresets from './presets';

const name = pkg.name;

export default (options) => {
    
  options = options || {};

  let presets = options.presets || defaultPresets;

  return {
    name,
    widgetController,
    widgetTemplate,
    settingsController,
    settingsTemplate,
    presets,
  };
};
