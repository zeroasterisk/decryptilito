// getting the stories for re-use
// for more, see https://medium.com/storybookjs/component-story-format-66f4c32366df
import '@testing-library/jest-dom/extend-expect';

import { render } from '@testing-library/react';

import { future, past } from '../stories/GameTurnBlock.stories';

describe('GameTurnBlock', () => {
  beforeAll(() => {
    // bugfix mock for
    // TypeError: window.matchMedia is not a function
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  it('past', () => {
    const comp = render(past());
    expect(comp.getByText('#1')).toBeTruthy();
    expect(comp.getByText('encryptor: Jerry')).toBeTruthy();
  });
  it('future', () => {
    const comp = render(future());
    expect(comp.getByText('#3')).toBeTruthy();
    expect(comp.queryByText('encryptor')).toBeNull();
  });
});
