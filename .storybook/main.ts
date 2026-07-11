import type { StorybookConfig } from '@storybook/react-vite'
import { withoutVitePlugins } from '@storybook/builder-vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/*.docs.@(mdx|ts|tsx)'
  ],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm]
          }
        }
      }
    }
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  docs: {},

  // Hide Storybook's onboarding UI (the "Guide" menu page and the sidebar
  // checklist widget) — this is a published library, not a fresh project.
  features: {
    menuOnboardingChecklist: false,
    sidebarOnboardingChecklist: false
  },

  viteFinal: async (config) => ({
    ...config,
    plugins: await withoutVitePlugins(config.plugins, ['vite:dts']) // skip dts plugin
  }),

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
}
export default config
