import { getValueFormats } from '@grafana/ui';
import _ from 'lodash';

export class AxesEditorCtrl {
  panel: any;
  panelCtrl: any;
  unitFormats: any;
  logScales: any;
  xAxisModes: any;
  xAxisStatOptions: any;
  xNameSegment: any;
  customUnit: any;

  /** @ngInject */
  constructor(private $scope, private $q) {
    this.panelCtrl = $scope.ctrl;
    this.panel = this.panelCtrl.panel;
    this.$scope.ctrl = this;

    this.unitFormats = getValueFormats();

    this.logScales = {
      linear: 1,
      'log (base 2)': 2,
      'log (base 10)': 10,
      'log (base 32)': 32,
      'log (base 1024)': 1024,
    };

    this.xAxisModes = {
      Time: 'time',
      Series: 'series',
      Histogram: 'histogram',
      // 'Data field': 'field',
    };

    this.xAxisStatOptions = [
      { text: 'Avg', value: 'avg' },
      { text: 'Min', value: 'min' },
      { text: 'Max', value: 'max' },
      { text: 'Total', value: 'total' },
      { text: 'Count', value: 'count' },
      { text: 'Current', value: 'current' },
    ];

    if (this.panel.xaxis.mode === 'custom') {
      if (!this.panel.xaxis.name) {
        this.panel.xaxis.name = 'specify field';
      }
    }

    for (let i = 0; i < this.panel.yaxes.length; i++) {
      const yaxis = this.panel.yaxes[i];

      if (yaxis.formatOverride === true) {
        for (let j = 0; j < this.unitFormats.length; j++) {
          const cat = this.unitFormats[j];
          for (let k = 0; k < cat.submenu.length; k++) {
            const format = cat.submenu[k];
            if (format.value === yaxis.format) {
              this.customUnit = format.text;
              break;
            }
          }
        }
      }
    }
  }

  setUnitFormat(axis, subItem) {
    if (subItem.value === 'provided_by_ds') {
      axis.formatOverride = true;
    } else {
      axis.format = subItem.value;
    }
    this.panelCtrl.render();
  }

  overrideUnit(axis) {
    axis.formatOverride = false;

    const miscCat = _.find(this.unitFormats, { text: 'Misc' }) as any;
    const dsFormat = _.find(miscCat.submenu, { value: 'provided_by_ds' });

    if (!dsFormat) {
      miscCat.submenu.push({
        text: 'Provided by datasource',
        value: 'provided_by_ds',
      });
    }
  }

  render() {
    this.panelCtrl.render();
  }

  xAxisModeChanged() {
    this.panelCtrl.processor.setPanelDefaultsForNewXAxisMode();
    this.panelCtrl.onDataReceived(this.panelCtrl.dataList);
  }

  xAxisValueChanged() {
    this.panelCtrl.onDataReceived(this.panelCtrl.dataList);
  }

  getDataFieldNames(onlyNumbers) {
    const props = this.panelCtrl.processor.getDataFieldNames(this.panelCtrl.dataList, onlyNumbers);
    const items = props.map(prop => {
      return { text: prop, value: prop };
    });

    return this.$q.when(items);
  }
}

/** @ngInject */
export function axesEditorComponent() {
  'use strict';
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'public/app/plugins/panel/graph/axes_editor.html',
    controller: AxesEditorCtrl,
  };
}
