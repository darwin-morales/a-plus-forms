/* @flow */
import React from 'react';
import field from '../core/field';
import type { InputProps, InputEvent } from '../types';

type SliderProps = InputProps & {
  min?: number,
  max?: number,
  step?: number,
  value: ?number
};

@field()
export default class Slider extends React.Component<SliderProps> {
  onChange = (event: InputEvent) => {
    this.props.onChange(parseFloat(event.target.value));
  };

  render() {
    const { min = 0, max = 10, step = 1, value = 0, ...rest } = this.props;

    return (
      <input
        {...rest}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={this.onChange}
        onMouseUp={this.onChange}
      />
    );
  }
}
