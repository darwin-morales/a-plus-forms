/* @flow */
import React from 'react';
import field from '../core/field';
import type { InputProps, InputEvent } from '../types';

@field()
export default class PasswordInput extends React.Component<InputProps> {
  onChange = (event: InputEvent) => {
    this.props.onChange(event.target.value);
  };

  render() {
    const { value, ...rest } = this.props;
    return <input type="password" {...rest} value={value || ''} onChange={this.onChange} />;
  }
}
