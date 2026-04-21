import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedLoaded,
  type RouteRecordRaw,
} from 'vue-router'
import Home from '../views/index.vue'
import BanGDream from '../views/BanG_Dream.vue'
import LoveLive from '../views/LoveLive.vue'
import PJSK from '../views/PJSK.vue'

type SeoMeta = {
  title: string
  description: string
  keywords: string
  ogImage: string
  themeColor: string
  canonicalPath: string
}

const siteName = '邦烤拉同好群地图聚合镜像站'
const siteDescription =
  '聚合 BanG Dream!、LoveLive! 与世界计划 Project SEKAI 的同好群地图镜像入口。'

const defaultSeo: SeoMeta = {
  title: `${siteName} | BanG Dream! / LoveLive! / Project SEKAI`,
  description: siteDescription,
  keywords:
    '同好群地图,聚合镜像,镜像地图,BanG Dream,LoveLive,Project SEKAI,PJSK,邦邦,拉拉,世界计划',
  ogImage: '/favicon.svg',
  themeColor: '#08111f',
  canonicalPath: '/',
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      ...defaultSeo,
    },
  },
  {
    path: '/bang-dream',
    alias: ['/BanG'],
    name: 'bang-dream',
    component: BanGDream,
    meta: {
      title: 'BanG Dream! 同好群地图镜像 | 全国邦邦群地图导航',
      description:
        '查看 BanG Dream! 全国各省及海外地区同好群地图镜像入口，直达邦邦群地图页面，快速进入对应分区导航。',
      keywords:
        'BanG Dream,邦邦,同好群地图,群地图镜像,全国邦邦群地图,QQ同好群,邦邦地图',
      ogImage: '/maps/Bang_Dream/BanG_Dream!_logo.svg',
      themeColor: '#ef476f',
      canonicalPath: '/bang-dream',
    },
  },
  {
    path: '/love-live',
    alias: ['/LoveLive', '/lovelive'],
    name: 'love-live',
    component: LoveLive,
    meta: {
      title: 'LoveLive! 同好群地图镜像 | 全国拉群地图导航',
      description:
        '查看 LoveLive! 全国各省及海外地区同好群地图镜像入口，快速进入拉拉群地图页面并直达对应镜像内容。',
      keywords:
        'LoveLive,lovelive,拉拉,同好群地图,群地图镜像,全国拉群地图,QQ同好群,拉群地图',
      ogImage: '/maps/LoveLive/Love_Live.svg',
      themeColor: '#f59e0b',
      canonicalPath: '/love-live',
    },
  },
  {
    path: '/pjsk',
    alias: ['/PJSK', '/project-sekai'],
    name: 'pjsk',
    component: PJSK,
    meta: {
      title: 'Project SEKAI 同好群地图镜像 | 世界计划群地图导航',
      description:
        '查看世界计划 Project SEKAI 全国各省及海外地区同好群地图镜像入口，快速进入烤群地图页面。',
      keywords:
        'Project SEKAI,PJSK,世界计划,烤群,同好群地图,群地图镜像,全国烤群地图,QQ同好群',
      ogImage: '/maps/PJSK/PJSK.png',
      themeColor: '#38bdf8',
      canonicalPath: '/pjsk',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const setMetaTag = (
  selector: string,
  attributes: Record<string, string>,
  content: string,
) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => {
      element?.setAttribute(key, value)
    })
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

const setLinkTag = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

const setSchema = (
  to: RouteLocationNormalizedLoaded,
  seo: SeoMeta,
  canonicalUrl: string,
) => {
  let element = document.head.querySelector<HTMLScriptElement>('#app-schema')

  if (!element) {
    element = document.createElement('script')
    element.id = 'app-schema'
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }

  const websiteUrl = new URL('/', window.location.origin).toString()
  const schema =
    to.path === '/'
      ? {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: seo.title,
          description: seo.description,
          url: canonicalUrl,
          inLanguage: 'zh-CN',
          isPartOf: {
            '@type': 'WebSite',
            name: siteName,
            url: websiteUrl,
          },
          hasPart: [
            {
              '@type': 'WebPage',
              name: 'BanG Dream! 同好群地图镜像',
              url: new URL('/bang-dream', window.location.origin).toString(),
            },
            {
              '@type': 'WebPage',
              name: 'LoveLive! 同好群地图镜像',
              url: new URL('/love-live', window.location.origin).toString(),
            },
            {
              '@type': 'WebPage',
              name: 'Project SEKAI 同好群地图镜像',
              url: new URL('/pjsk', window.location.origin).toString(),
            },
          ],
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: seo.title,
          description: seo.description,
          url: canonicalUrl,
          inLanguage: 'zh-CN',
          isPartOf: {
            '@type': 'WebSite',
            name: siteName,
            url: websiteUrl,
          },
        }

  element.textContent = JSON.stringify(schema)
}

router.afterEach((to) => {
  const seo = {
    ...defaultSeo,
    ...(to.meta as Partial<SeoMeta>),
  }
  const canonicalUrl = new URL(seo.canonicalPath, window.location.origin).toString()

  document.title = seo.title
  document.documentElement.lang = 'zh-CN'

  setMetaTag('meta[name="description"]', { name: 'description' }, seo.description)
  setMetaTag('meta[name="keywords"]', { name: 'keywords' }, seo.keywords)
  setMetaTag('meta[name="theme-color"]', { name: 'theme-color' }, seo.themeColor)
  setMetaTag('meta[property="og:type"]', { property: 'og:type' }, 'website')
  setMetaTag('meta[property="og:locale"]', { property: 'og:locale' }, 'zh_CN')
  setMetaTag('meta[property="og:site_name"]', { property: 'og:site_name' }, siteName)
  setMetaTag('meta[property="og:title"]', { property: 'og:title' }, seo.title)
  setMetaTag(
    'meta[property="og:description"]',
    { property: 'og:description' },
    seo.description,
  )
  setMetaTag('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl)
  setMetaTag('meta[property="og:image"]', { property: 'og:image' }, seo.ogImage)
  setMetaTag('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
  setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }, seo.title)
  setMetaTag(
    'meta[name="twitter:description"]',
    { name: 'twitter:description' },
    seo.description,
  )
  setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' }, seo.ogImage)
  setLinkTag('canonical', canonicalUrl)
  setSchema(to, seo, canonicalUrl)
})

export default router
