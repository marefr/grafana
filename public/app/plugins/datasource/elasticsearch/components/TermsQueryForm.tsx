import React, { PureComponent, ChangeEvent } from 'react';
import { Select, SelectOptionItem, FormLabel, Input } from '@grafana/ui';

export interface TermsQueryFormProps {
  query: any;
  fields: SelectOptionItem[];
  onChange: (query: any, definition: string) => void;
}

export interface TermsQueryFormState {
  field: string;
  query: string;
  size: string;
  orderBy: string;
  order: string;
}

const defaultState: TermsQueryFormState = {
  field: '',
  query: '',
  size: '',
  orderBy: '_term',
  order: 'asc',
};

const orderByOptions: SelectOptionItem[] = [
  { value: '_term', label: 'Term value' },
  { value: '_count', label: 'Doc count' },
];

const orderOptions: SelectOptionItem[] = [{ value: 'asc', label: 'Ascending' }, { value: 'desc', label: 'Descending' }];

export class TermsQueryForm extends PureComponent<TermsQueryFormProps, TermsQueryFormState> {
  constructor(props: TermsQueryFormProps) {
    super(props);
    this.state = {
      ...defaultState,
      ...props.query,
      size: props.query.size ? props.query.size.toString() : '',
    };
  }

  triggerChange() {
    const { onChange } = this.props;
    const { field, query, size, orderBy, order } = this.state;
    const termsQuery: any = {
      find: 'terms',
      field,
    };

    if (defaultState.field === field) {
      return;
    }

    if (defaultState.query !== query) {
      termsQuery.query = query;
    }

    if (defaultState.size !== size) {
      termsQuery.size = Number.parseInt(size, 10);
    }

    if (defaultState.orderBy !== orderBy) {
      termsQuery.orderBy = orderBy;
    }

    if (defaultState.order !== order) {
      termsQuery.order = order;
    }

    onChange(termsQuery, `Terms(${field})`);
  }

  onFieldChange = (item: SelectOptionItem) => {
    this.setState(
      {
        field: item.value,
      },
      () => {
        this.triggerChange();
      }
    );
  };

  onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: event.target.value,
    });
  };

  onQueryBlur = () => {
    this.triggerChange();
  };

  onSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      size: event.target.value,
    });
  };

  onSizeBlur = () => {
    this.triggerChange();
  };

  onOrderByChange = (item: SelectOptionItem) => {
    let { order } = this.state;
    const orderBy = item.value;

    if (orderBy === '_count') {
      order = 'desc';
    }

    this.setState(
      {
        orderBy,
        order,
      },
      () => {
        this.triggerChange();
      }
    );
  };

  onOrderChange = (item: SelectOptionItem) => {
    this.setState(
      {
        order: item.value,
      },
      () => {
        this.triggerChange();
      }
    );
  };

  render() {
    const { fields } = this.props;
    const { field, query = '', size, orderBy, order } = this.state;
    return (
      <>
        <div className="form-field">
          <FormLabel className="query-keyword">Field</FormLabel>
          <Select
            placeholder="Choose field"
            options={fields}
            value={fields.find(o => o.value === field)}
            onChange={this.onFieldChange}
            width={11}
          />
        </div>
        <div className="form-field">
          <FormLabel className="query-keyword">Query</FormLabel>
          <Input placeholder="lucene query" onBlur={this.onQueryBlur} onChange={this.onQueryChange} value={query} />
        </div>
        <div className="form-field">
          <FormLabel className="query-keyword">Size</FormLabel>
          <Input
            className="gf-form-input width-6"
            placeholder="500"
            onBlur={this.onSizeBlur}
            onChange={this.onSizeChange}
            type="number"
            value={size}
          />
        </div>
        <div className="form-field">
          <FormLabel className="query-keyword">Order By</FormLabel>
          <Select
            placeholder="Choose order"
            options={orderByOptions}
            value={orderByOptions.find(o => o.value === orderBy)}
            onChange={this.onOrderByChange}
            width={11}
          />
          <Select
            placeholder="Choose order"
            options={orderOptions}
            value={orderOptions.find(o => o.value === order)}
            onChange={this.onOrderChange}
            width={11}
          />
        </div>
      </>
    );
  }
}
