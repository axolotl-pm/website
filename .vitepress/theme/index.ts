// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import "@catppuccin/vitepress/theme/mocha/blue.css"
import './content.css'
import './footer.css'
import { footerMessage } from '../footer'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-after': () => h('p', { class: 'doc-disclaimer' }, footerMessage),
      // Animated logo in the hero; the static one is used when the visitor asks for reduced motion.
      'home-hero-image': () => h('picture', null, [
        h('source', { media: '(prefers-reduced-motion: reduce)', srcset: '/img/axolotl-logo.svg' }),
        h('img', {
          class: 'hero-logo',
          src: '/img/axolotl-logo-animated.svg',
          alt: 'Axolotl-PM logo: a blue axolotl curled into a ring',
          width: 512,
          height: 512,
          fetchpriority: 'high'
        })
      ])
    })
  },
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
  }
} satisfies Theme
