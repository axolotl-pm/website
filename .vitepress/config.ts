import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Axolotl-PM",
  description: "Official home for Axolotl-PM",
  // Sphinx curls quotes and dashes at render time (docutils smartquotes); this is the markdown-it equivalent.
  markdown: {
    typographer: true
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/docs' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          {
            text: 'Installation &amp; Updating',
            link: '/docs/installation',
            collapsed: true,
            items: [
              { text: 'Setup requirements', link: '/docs/installation/requirements' },
              { text: 'Using the official installer (Linux/MacOS only)', link: '/docs/installation/get-dot-pmmp-dot-io' },
              { text: 'Using Docker (Linux only)', link: '/docs/installation/docker' },
              { text: 'Installing/updating manually', link: '/docs/installation/installing-manually' }
            ]
          },
          { text: 'Basic usage', link: '/docs/basic-usage' },
          {
            text: 'Connecting',
            link: '/docs/connecting',
            collapsed: true,
            items: [
              { text: 'Adding the server to Minecraft', link: '/docs/connecting/add-external-server' },
              { text: 'Opening ports in your firewall', link: '/docs/connecting/configure-firewall' },
              { text: 'Forwarding ports in your router', link: '/docs/connecting/portforward' }
            ]
          },
          { text: 'Configuration', link: '/docs/configuration' },
          { text: 'Plugins', link: '/docs/plugins' },
          { text: 'Worlds', link: '/docs/worlds' },
          { text: 'Resource Packs &amp; Behaviour Packs', link: '/docs/resourcepacks' },
          {
            text: 'Permissions',
            link: '/docs/permissions',
            collapsed: true,
            items: [
              { text: 'List of built-in permissions', link: '/docs/core-permissions' }
            ]
          },
          { text: 'Contributing', link: '/docs/contributing' },
          {
            text: 'Bugs &amp; Crashes',
            link: '/docs/issues',
            collapsed: true,
            items: [
              { text: 'Crashes', link: '/docs/issues/crashes' },
              { text: 'Reporting Bugs', link: '/docs/issues/github-issues' }
            ]
          },
          { text: 'Contact and Support', link: '/docs/contact' }
        ]
      },
      {
        text: 'Frequently Asked Questions &amp; Common Issues',
        items: [
          {
            text: 'Installation',
            link: '/docs/faq/installation',
            collapsed: true,
            items: [
              { text: 'Failed loading opcache.so (or other PHP extensions)', link: '/docs/faq/installation/opcache.so' },
              { text: 'PocketMine-MP.phar not found when running server', link: '/docs/faq/installation/pharnotfound' },
              { text: 'Can’t install as user root', link: '/docs/faq/installation/rootuser' },
              { text: 'Can I install Axolotl-PM on Windows XP?', link: '/docs/faq/installation/windowsxp' }
            ]
          },
          {
            text: 'Connecting',
            link: '/docs/faq/connecting',
            collapsed: true,
            items: [
              { text: 'Can’t connect to the server after updating Minecraft', link: '/docs/faq/connecting/cantconnect' },
              { text: 'What does “Opening server on 0.0.0.0:19132” mean?', link: '/docs/faq/connecting/defaultrouteip' },
              { text: '“Login timeout” when attempting to connect', link: '/docs/faq/connecting/logintimeout' },
              { text: 'RakLib Thread Blocked x.x.x.x for x seconds', link: '/docs/faq/connecting/raklibthreadblocked' },
              { text: 'Stuck on “Locating server” or at downloading resource packs', link: '/docs/faq/connecting/stuckduringconnect' },
              { text: 'VPN connection and gameplay issues', link: '/docs/faq/connecting/vpnproblems' },
              { text: 'Minecraft can’t connect to a server on the same computer on Windows', link: '/docs/faq/connecting/win10localhostcantconnect' }
            ]
          },
          {
            text: 'Playing',
            link: '/docs/faq/playing',
            collapsed: true,
            items: [
              { text: 'Why doesn’t X or Y gameplay feature work on Axolotl-PM? Is it a bug?', link: '/docs/faq/playing/missingfeatures' },
              { text: 'Can Minecraft: Java Edition (PC) clients connect to a Axolotl-PM server?', link: '/docs/faq/playing/playwithpc' }
            ]
          },
          {
            text: 'Plugins',
            link: '/docs/faq/plugins',
            collapsed: true,
            items: [
              { text: 'What does “Incompatible API version” mean when loading a plugin?', link: '/docs/faq/plugins/incompatibleapi' },
              { text: 'I can’t get a <code>.phar</code> for a plugin. How do I create one?', link: '/docs/faq/plugins/makephar' },
              { text: 'Can I run a plugin from source without creating a <code>.phar</code>?', link: '/docs/faq/plugins/usephpfiles' }
            ]
          },
          {
            text: 'About Axolotl-PM',
            link: '/docs/faq/about',
            collapsed: true,
            items: [
              { text: 'What’s the difference between PMMP and PocketMine?', link: '/docs/faq/about/pocketmine-vs-pmmp' },
              { text: 'Who is @shoghicp?', link: '/docs/faq/about/shoghicp' },
              { text: 'Why PHP?', link: '/docs/faq/about/why-php' }
            ]
          }
        ]
      },
      {
        text: 'Developer Resources',
        items: [
          {
            text: 'Plugin development docs',
            link: '/docs/developers/plugin-docs-index',
            collapsed: true,
            items: [
              { text: 'API versioning', link: '/docs/developers/plugin-docs/api-version-spec' },
              {
                text: 'Events',
                link: '/docs/developers/plugin-docs/events',
                collapsed: true,
                items: [
                  { text: 'Using the <code>pocketmine\\event\\Listener</code> interface', link: '/docs/developers/plugin-docs/events/listener-interface' },
                  { text: 'Event handler priority', link: '/docs/developers/plugin-docs/events/priority' }
                ]
              },
              { text: 'Inventory Transactions', link: '/docs/developers/plugin-docs/inventory-transactions' },
              {
                text: 'Plugin formats',
                link: '/docs/developers/plugin-docs/plugin-formats',
                collapsed: true,
                items: [
                  { text: 'Standard plugin types', link: '/docs/developers/plugin-docs/plugin-formats/standard' },
                  { text: 'Development plugin types', link: '/docs/developers/plugin-docs/plugin-formats/development' },
                  { text: 'Frequently Asked Questions', link: '/docs/developers/plugin-docs/plugin-formats/faq' }
                ]
              },
              { text: '<code>plugin.yml</code> fields', link: '/docs/developers/plugin-docs/plugin-manifest' }
            ]
          },
          {
            text: 'Axolotl-PM internal development docs',
            link: '/docs/developers/internals-docs-index',
            collapsed: true,
            items: [
              { text: 'How to add a new <em>vanilla</em> block to Axolotl-PM', link: '/docs/developers/internals-docs/adding-vanilla-blocks' },
              { text: 'Implementing new Minecraft version support in Axolotl-PM', link: '/docs/developers/internals-docs/updating-minecraft-protocol' }
            ]
          },
          { text: 'Threading in PHP - WTF?', link: '/docs/developers/threading-in-php-wtf' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/axolotl-pm/PocketMine-MP' }
    ]
  }
})
