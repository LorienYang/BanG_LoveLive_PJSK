<script setup lang="ts">
const mirrors = [
  {
    route: '/bang-dream',
    title: 'BanG Dream!',
    subtitle: '全国邦邦群地图镜像',
    description: '进入 BanG Dream! 同好群地图镜像，查看对应地区入口。',
    logo: '/maps/Bang_Dream/BanG_Dream!_logo.svg',
    accent:
      'from-rose-300/24 via-rose-200/10 to-transparent hover:border-rose-200/35 hover:shadow-[0_28px_88px_-36px_rgba(251,113,133,0.86)]',
    badge: 'border-rose-200/25 bg-rose-300/10 text-rose-100',
  },
  {
    route: '/love-live',
    title: 'LoveLive!',
    subtitle: '全国拉群地图镜像',
    description: '进入 LoveLive! 同好群地图镜像，直达拉拉地图页面。',
    logo: '/maps/LoveLive/Love_Live.svg',
    accent:
      'from-amber-200/24 via-amber-100/10 to-transparent hover:border-amber-200/35 hover:shadow-[0_28px_88px_-36px_rgba(251,191,36,0.8)]',
    badge: 'border-amber-200/25 bg-amber-300/10 text-amber-100',
  },
  {
    route: '/pjsk',
    title: 'Project SEKAI',
    subtitle: '世界计划群地图镜像',
    description: '进入 Project SEKAI 同好群地图镜像，快速前往世界计划地图。',
    logo: '/maps/PJSK/PJSK.png',
    accent:
      'from-sky-200/24 via-cyan-100/10 to-transparent hover:border-sky-200/35 hover:shadow-[0_28px_88px_-36px_rgba(56,189,248,0.82)]',
    badge: 'border-sky-200/25 bg-sky-300/10 text-sky-100',
  },
] as const
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#050505] text-stone-100">
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.12),_transparent_26%),radial-gradient(circle_at_82%_14%,_rgba(255,255,255,0.07),_transparent_18%),linear-gradient(180deg,_#141414_0%,_#0a0a0a_44%,_#020202_100%)]"
    />
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/55 to-transparent" />

    <div class="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-10 lg:py-10">
      <header class="mx-auto max-w-4xl text-center">
        <p class="text-[11px] uppercase tracking-[0.42em] text-[#d4af37]/80">
          Maps Mirror
        </p>
        <h1 class="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
          同好群地图聚合镜像站
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
          聚合 BanG Dream!、LoveLive! 与 Project SEKAI 三个镜像入口。
          选择下方项目，即可直接进入对应地图页面。
        </p>
      </header>

      <main class="flex flex-1 flex-col justify-center py-12 lg:py-16">
        <div class="grid gap-5">
          <RouterLink
            v-for="mirror in mirrors"
            :key="mirror.route"
            :to="mirror.route"
            :class="[
              'group cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r p-6 transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none sm:p-7 lg:p-8',
              mirror.accent,
            ]"
          >
            <div class="flex items-center gap-5">
              <div class="min-w-0 flex-1 text-left">
                <span
                  :class="[
                    'inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.28em]',
                    mirror.badge,
                  ]"
                >
                  {{ mirror.title }}
                </span>
                <h2 class="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {{ mirror.subtitle }}
                </h2>
                <p class="mt-3 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
                  {{ mirror.description }}
                </p>
              </div>

              <div
                class="hidden h-24 w-24 shrink-0 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/10 p-4 sm:flex"
              >
                <img
                  :src="mirror.logo"
                  :alt="`${mirror.title} logo`"
                  class="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </RouterLink>
        </div>
      </main>

      <footer
        class="mx-auto flex max-w-3xl flex-col items-center justify-center gap-3 rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-6 text-center text-sm leading-7 text-stone-400 backdrop-blur-xl"
      >
        <p>
          本站与 BanG Dream!、LoveLive!、Project SEKAI 及其官方运营主体均无从属关系，仅提供镜像导航入口。
        </p>
        <p>
          地图数据来自网络整理，基于
          <a
            href="https://github.com/HELPMEEADICE/china-bandori-maps"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-200 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/70"
          >
            china-bandori-maps
          </a>
          、
          <a
            href="https://github.com/HELPMEEADICE/china-lovelive-maps"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-200 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/70"
          >
            china-lovelive-maps
          </a>
          、
          <a
            href="https://github.com/HELPMEEADICE/china-pjsk-maps"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-200 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/70"
          >
            china-pjsk-maps
          </a>
          项目。
        </p>
        <p>
          <a
            href="https://beian.miit.gov.cn/#/Integrated/index"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-200 underline decoration-white/25 underline-offset-4 transition hover:text-white hover:decoration-white/70"
          >
            浙ICP备2025171659号-2
          </a>
        </p>
      </footer>
    </div>
  </div>
</template>
