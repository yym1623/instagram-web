
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  Menu: typeof import("../../app/components/Menu.vue")['default']
  ModalsCreateFeed: typeof import("../../app/components/Modals/CreateFeed.vue")['default']
  ModalsCreateStory: typeof import("../../app/components/Modals/CreateStory.vue")['default']
  ModalsLikesModal: typeof import("../../app/components/Modals/LikesModal.vue")['default']
  ModalsMessageSend: typeof import("../../app/components/Modals/MessageSend.vue")['default']
  ModalsPostCommentModal: typeof import("../../app/components/Modals/PostCommentModal.vue")['default']
  ModalsPostSettingModal: typeof import("../../app/components/Modals/PostSettingModal.vue")['default']
  ModalsShareModal: typeof import("../../app/components/Modals/ShareModal.vue")['default']
  FeedCard: typeof import("../../app/components/feed/FeedCard.vue")['default']
  FeedRightSidebar: typeof import("../../app/components/feed/RightSidebar.vue")['default']
  FeedStoriesBar: typeof import("../../app/components/feed/StoriesBar.vue")['default']
  NuxtWelcome: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyMenu: LazyComponent<typeof import("../../app/components/Menu.vue")['default']>
  LazyModalsCreateFeed: LazyComponent<typeof import("../../app/components/Modals/CreateFeed.vue")['default']>
  LazyModalsCreateStory: LazyComponent<typeof import("../../app/components/Modals/CreateStory.vue")['default']>
  LazyModalsLikesModal: LazyComponent<typeof import("../../app/components/Modals/LikesModal.vue")['default']>
  LazyModalsMessageSend: LazyComponent<typeof import("../../app/components/Modals/MessageSend.vue")['default']>
  LazyModalsPostCommentModal: LazyComponent<typeof import("../../app/components/Modals/PostCommentModal.vue")['default']>
  LazyModalsPostSettingModal: LazyComponent<typeof import("../../app/components/Modals/PostSettingModal.vue")['default']>
  LazyModalsShareModal: LazyComponent<typeof import("../../app/components/Modals/ShareModal.vue")['default']>
  LazyFeedCard: LazyComponent<typeof import("../../app/components/feed/FeedCard.vue")['default']>
  LazyFeedRightSidebar: LazyComponent<typeof import("../../app/components/feed/RightSidebar.vue")['default']>
  LazyFeedStoriesBar: LazyComponent<typeof import("../../app/components/feed/StoriesBar.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../../../node_modules/.pnpm/nuxt@4.3.1_@parcel+watcher@2.5.6_@types+node@22.19.11_@vue+compiler-sfc@3.5.28_cac@6.7._ad4df558ce43f77bb1385800081c9398/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
