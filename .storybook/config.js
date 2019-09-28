import { configure } from '@storybook/react';

// function loadStories() {
//   require('../src/stories');
// }
//
// configure(loadStories, module);
//
configure(require.context('../src/', true, /\.stories\.(jsx|mdx)$/), module);
