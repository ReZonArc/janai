import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Technical documentation sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Technical Documentation',
      items: [
        'ARCHITECTURE',
        'EXTENSION_DEVELOPMENT',
        'CONFIGURATION',
        'DEVELOPMENT',
      ],
    },
    {
      type: 'link',
      label: 'Main Repository',
      href: 'https://github.com/lencx/Noi',
    },
  ],
};

export default sidebars;
