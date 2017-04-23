/* @flow */
import React from 'react';
import field from '../core/field';

type Option = {
  label: string,
  value: any,
  disabled?: boolean
};

type InputEvent = {
  target: {
    value: string
  }
};

@field()
export default class Select extends React.Component {
  onChange = (event: InputEvent) => {
    this.props.onChange(event.target.value);
  }

  props: {
    value?: any,
    onChange: Function,
    options?: Array<Option>
  }

  render() {
    const { value, options = [], ...rest } = this.props;

    return (
      <select {...rest} value={value} onChange={this.onChange}>
        {options.map(({ label, value, disabled }, i) =>
          <option key={i} value={value} disabled={disabled}>{label}</option>
        )}
      </select>
    );
  }
}
