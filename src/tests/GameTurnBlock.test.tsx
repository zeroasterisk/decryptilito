// getting the stories for re-use
// for more, see https://medium.com/storybookjs/component-story-format-66f4c32366df
import '@testing-library/jest-dom/extend-expect';

import React from 'react';

import { render } from '@testing-library/react';

import { future, past } from '../stories/GameTurnBlock.stories';

describe('GameTurnBlock', () => {
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
