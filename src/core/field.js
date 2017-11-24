import React from 'react';
import PropTypes from 'prop-types';
import Layout from './layout';
import StateManager from './state';
import { extractErrorsFor } from './error';
import type { FieldProps, FieldOptions, Component, Valuable } from '../types';

export default (options: FieldOptions = {}) => (Input: Component): Component =>
  class Field extends React.Component<FieldProps> {
    static defaultProps = {
      onChange: () => {}
    };

    static contextTypes = {
      APFState: PropTypes.object,
      APFError: PropTypes.object,
      APFDirty: PropTypes.bool
    };

    static childContextTypes = {
      APFState: PropTypes.object, // nested field anchor
      APFProps: PropTypes.object, // original field props,
      APFError: PropTypes.object, // nested field errors
      APFDirty: PropTypes.bool
    };

    stateManager: StateManager;

    constructor() {
      super();

      this.stateManager = new StateManager(this);
    }

    getChildContext() {
      return {
        APFProps: this.props,
        APFDirty: this.props.dirty,
        APFState: options.nested && this.stateManager,
        APFError:
          (options.nested && typeof this.props.error === 'object' && this.props.error) || undefined
      };
    }

    componentWillMount() {
      this.checkForNewValueIn(this.props, true);

      if (this.context.APFState) {
        this.context.APFState.register(this);
      }
    }

    componentWillUnmount() {
      if (this.context.APFState) {
        this.context.APFState.unregister(this);
      }
    }

    componentWillReceiveProps(props: Valuable) {
      this.checkForNewValueIn(props, false);
    }

    checkForNewValueIn(props: Valuable, isInitialCall: boolean) {
      const triggerOnChange = !isInitialCall;

      if ('value' in props) {
        this.stateManager.setValue(props.value, triggerOnChange);
      } else if ('defaultValue' in props) {
        // something was changed or an initial call
        if (isInitialCall || this.props.defaultValue !== props.defaultValue) {
          this.stateManager.setValue(props.defaultValue, triggerOnChange);
        }
      }
    }

    get name() {
      return this.props.name;
    }

    get value(): any {
      return this.stateManager.getValue();
    }

    set value(value: any) {
      this.stateManager.setValue(value);
    }

    get error(): ?string {
      return extractErrorsFor(this, options);
    }

    get dirty(): boolean {
      const { dirty } = this.props;
      return dirty === undefined ? this.context.APFDirty : dirty;
    }

    onChange = (value: any) => {
      this.value = value;
    };

    render() {
      const { defaultValue, error, dirty, ...props } = this.props; // eslint-disable-line

      Object.assign(props, { value: this.value, onChange: this.onChange });

      return (
        <Layout
          input={Input}
          props={props}
          error={this.error}
          dirty={this.dirty}
          layout={options.layout}
        />
      );
    }
  };
