import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App1 from '../App';

describe('App', () => {
  it('should render', () => {
    expect(render(<App1 />)).toBeTruthy();
  });
});
