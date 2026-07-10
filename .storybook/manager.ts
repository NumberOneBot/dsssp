import { addons } from 'storybook/manager-api'
import theme from './theme'

addons.setConfig({
  theme,
  navSize: 260,
  bottomPanelHeight: 400,
  rightPanelWidth: 300,
  enableShortcuts: true,
  showToolbar: false,
  sidebar: {
    // showRoots: false
    collapsedRoots: ['Components']
  }
  // panelPosition: 'bottom',
  // selectedPanel: undefined,
  // initialActive: 'sidebar',
  // sidebar: {
  //   showRoots: true,
  //   collapsedRoots: ['other']
  // },
  // toolbar: {
  //   zoom: { hidden: false },
  //   copy: { hidden: false },
  //   eject: { hidden: true },
  //   title: { hidden: true },
  //   fullscreen: { hidden: true }
  // }
})
