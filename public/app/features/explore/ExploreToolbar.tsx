import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';

import { ExploreId } from 'app/types/explore';
import {
  DataSourceSelectItem,
  RawTimeRange,
  ClickOutsideWrapper,
  TimeZone,
  TimeRange,
  ButtonSelect,
  SelectOptionItem,
  QueryType,
} from '@grafana/ui';
import { DataSourcePicker } from 'app/core/components/Select/DataSourcePicker';
import { StoreState } from 'app/types/store';
import {
  changeDatasource,
  clearQueries,
  splitClose,
  runQueries,
  splitOpen,
  changeRefreshInterval,
  changeQueryType,
} from './state/actions';
import TimePicker from './TimePicker';
import { getTimeZone } from '../profile/state/selectors';
import { RefreshPicker, SetInterval } from '@grafana/ui';

enum IconSide {
  left = 'left',
  right = 'right',
}

const createResponsiveButton = (options: {
  splitted: boolean;
  title: string;
  onClick: () => void;
  buttonClassName?: string;
  iconClassName?: string;
  iconSide?: IconSide;
}) => {
  const defaultOptions = {
    iconSide: IconSide.left,
  };
  const props = { ...options, defaultOptions };
  const { title, onClick, buttonClassName, iconClassName, splitted, iconSide } = props;

  return (
    <button className={`btn navbar-button ${buttonClassName ? buttonClassName : ''}`} onClick={onClick}>
      {iconClassName && iconSide === IconSide.left ? <i className={`${iconClassName}`} /> : null}
      <span className="btn-title">{!splitted ? title : ''}</span>
      {iconClassName && iconSide === IconSide.right ? <i className={`${iconClassName}`} /> : null}
    </button>
  );
};

interface OwnProps {
  exploreId: ExploreId;
  timepickerRef: React.RefObject<TimePicker>;
  onChangeTime: (range: RawTimeRange, changedByScanner?: boolean) => void;
}

interface StateProps {
  datasourceMissing: boolean;
  exploreDatasources: DataSourceSelectItem[];
  loading: boolean;
  range: TimeRange;
  timeZone: TimeZone;
  selectedDatasource: DataSourceSelectItem;
  splitted: boolean;
  refreshInterval: string;
  supportedQueryTypeOptions: Array<SelectOptionItem<QueryType>>;
  selectedQueryTypeOption: SelectOptionItem<QueryType>;
}

interface DispatchProps {
  changeDatasource: typeof changeDatasource;
  clearAll: typeof clearQueries;
  runQueries: typeof runQueries;
  closeSplit: typeof splitClose;
  split: typeof splitOpen;
  changeRefreshInterval: typeof changeRefreshInterval;
  changeDataType: typeof changeQueryType;
}

type Props = StateProps & DispatchProps & OwnProps;

export class UnConnectedExploreToolbar extends PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  onChangeDatasource = async option => {
    this.props.changeDatasource(this.props.exploreId, option.value);
  };

  onClearAll = () => {
    this.props.clearAll(this.props.exploreId);
  };

  onRunQuery = () => {
    return this.props.runQueries(this.props.exploreId);
  };

  onCloseTimePicker = () => {
    this.props.timepickerRef.current.setState({ isOpen: false });
  };

  onChangeRefreshInterval = (item: string) => {
    const { changeRefreshInterval, exploreId } = this.props;
    changeRefreshInterval(exploreId, item);
  };

  onDataTypeChange = (item: SelectOptionItem<QueryType>) => {
    const { changeDataType, exploreId } = this.props;
    changeDataType(exploreId, item.value);
  };

  render() {
    const {
      datasourceMissing,
      exploreDatasources,
      closeSplit,
      exploreId,
      loading,
      range,
      timeZone,
      selectedDatasource,
      splitted,
      timepickerRef,
      refreshInterval,
      onChangeTime,
      split,
      supportedQueryTypeOptions,
      selectedQueryTypeOption,
    } = this.props;

    return (
      <div className={splitted ? 'explore-toolbar splitted' : 'explore-toolbar'}>
        <div className="explore-toolbar-item">
          <div className="explore-toolbar-header">
            <div className="explore-toolbar-header-title">
              {exploreId === 'left' && (
                <span className="navbar-page-btn">
                  <i className="gicon gicon-explore" />
                  Explore
                </span>
              )}
            </div>
            {splitted && (
              <a className="explore-toolbar-header-close" onClick={() => closeSplit(exploreId)}>
                <i className="fa fa-times fa-fw" />
              </a>
            )}
          </div>
        </div>
        <div className="explore-toolbar-item">
          <div className="explore-toolbar-content">
            {!datasourceMissing ? (
              <div className="explore-toolbar-content-item">
                <div className="datasource-picker">
                  <DataSourcePicker
                    onChange={this.onChangeDatasource}
                    datasources={exploreDatasources}
                    current={selectedDatasource}
                  />
                </div>
              </div>
            ) : null}
            {exploreId === 'left' && !splitted ? (
              <div className="explore-toolbar-content-item">
                {createResponsiveButton({
                  splitted,
                  title: 'Split',
                  onClick: split,
                  iconClassName: 'fa fa-fw fa-columns icon-margin-right',
                  iconSide: IconSide.left,
                })}
              </div>
            ) : null}
            {!datasourceMissing && supportedQueryTypeOptions.length > 1 ? (
              <div className="explore-toolbar-content-item">
                <ButtonSelect
                  className="navbar-button--attached btn--radius-left-0"
                  value={selectedQueryTypeOption}
                  label={selectedQueryTypeOption.label}
                  options={supportedQueryTypeOptions}
                  onChange={this.onDataTypeChange}
                  maxMenuHeight={380}
                />
              </div>
            ) : null}
            <div className="explore-toolbar-content-item timepicker">
              <ClickOutsideWrapper onClick={this.onCloseTimePicker}>
                <TimePicker ref={timepickerRef} range={range} isUtc={timeZone.isUtc} onChangeTime={onChangeTime} />
              </ClickOutsideWrapper>

              <RefreshPicker
                onIntervalChanged={this.onChangeRefreshInterval}
                onRefresh={this.onRunQuery}
                value={refreshInterval}
                tooltip="Refresh"
              />
              {refreshInterval && <SetInterval func={this.onRunQuery} interval={refreshInterval} />}
            </div>

            <div className="explore-toolbar-content-item">
              <button className="btn navbar-button" onClick={this.onClearAll}>
                Clear All
              </button>
            </div>
            <div className="explore-toolbar-content-item">
              {createResponsiveButton({
                splitted,
                title: 'Run Query',
                onClick: this.onRunQuery,
                buttonClassName: 'navbar-button--secondary',
                iconClassName: loading ? 'fa fa-spinner fa-fw fa-spin run-icon' : 'fa fa-level-down fa-fw run-icon',
                iconSide: IconSide.right,
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState, { exploreId }: OwnProps): StateProps => {
  const splitted = state.explore.split;
  const exploreItem = state.explore[exploreId];
  const {
    datasourceInstance,
    datasourceMissing,
    exploreDatasources,
    queryTransactions,
    range,
    refreshInterval,
    supportedQueryTypes: supportedDataTypes,
    queryType,
  } = exploreItem;
  const selectedDatasource = datasourceInstance
    ? exploreDatasources.find(datasource => datasource.name === datasourceInstance.name)
    : undefined;
  const loading = queryTransactions.some(qt => !qt.done);

  const supportedQueryTypeOptions: Array<SelectOptionItem<QueryType>> = [];
  let selectedQueryTypeOption = null;
  for (const supportedDataType of supportedDataTypes) {
    switch (supportedDataType) {
      case QueryType.Metrics:
        const option1 = {
          value: QueryType.Metrics,
          label: QueryType.Metrics,
        };
        supportedQueryTypeOptions.push(option1);
        if (queryType === QueryType.Metrics) {
          selectedQueryTypeOption = option1;
        }
        break;
      case QueryType.Logs:
        const option2 = {
          value: QueryType.Logs,
          label: QueryType.Logs,
        };
        supportedQueryTypeOptions.push(option2);
        if (queryType === QueryType.Logs) {
          selectedQueryTypeOption = option2;
        }
        break;
    }
  }

  return {
    datasourceMissing,
    exploreDatasources,
    loading,
    range,
    timeZone: getTimeZone(state.user),
    selectedDatasource,
    splitted,
    refreshInterval,
    supportedQueryTypeOptions,
    selectedQueryTypeOption,
  };
};

const mapDispatchToProps: DispatchProps = {
  changeDatasource,
  changeRefreshInterval,
  clearAll: clearQueries,
  runQueries,
  closeSplit: splitClose,
  split: splitOpen,
  changeDataType: changeQueryType,
};

export const ExploreToolbar = hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UnConnectedExploreToolbar)
);
