import { defineComponent, computed, mergeProps, unref, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { c as useAuthStore, a as useRoute, d as useRouter, b as useApi, _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@supabase/ssr';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CreateFeed",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(__props, { emit: __emit }) {
    const auth = useAuthStore();
    const step = ref(1);
    const isDragged = ref(false);
    const successImg = ref(false);
    const caption = ref("");
    const files = ref([]);
    const activeIndex = ref(0);
    const loading = ref(false);
    const errorMessage = ref("");
    const filterOptions = [
      { key: "original", label: "원본" },
      { key: "clarendon", label: "Clarendon" },
      { key: "gingham", label: "Gingham" },
      { key: "juno", label: "Juno" },
      { key: "moon", label: "Moon" },
      { key: "lark", label: "Lark" }
    ];
    const selectedFilter = ref("original");
    const editTab = ref("filter");
    const currentFile = computed(() => files.value[activeIndex.value] ?? null);
    const headerTitle = computed(() => {
      if (successImg.value) return "새 게시물 만들기";
      if (step.value === 2) return "자르기";
      if (step.value === 3) return "편집";
      return "새 게시물 만들기";
    });
    function filterClassFor(key) {
      switch (key) {
        case "clarendon":
          return "filter-clarendon";
        case "gingham":
          return "filter-gingham";
        case "juno":
          return "filter-juno";
        case "moon":
          return "filter-moon";
        case "lark":
          return "filter-lark";
        default:
          return "filter-original";
      }
    }
    const filterClass = computed(() => filterClassFor(selectedFilter.value));
    const modalWidthClass = computed(() => {
      if (step.value === 1 || step.value === 2) {
        return "w-full max-w-[620px]";
      }
      return "w-full max-w-[480px] lg:max-w-[960px]";
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-[120] flex items-center justify-center bg-black/25 px-3 py-6" data-v-cac96650><div class="${ssrRenderClass([unref(modalWidthClass), "bg-[rgb(33,35,40)] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col"])}" data-v-cac96650><header class="flex items-center justify-between px-4 py-1 border-b border-neutral-800 bg-[rgb(33,35,40)] text-white" data-v-cac96650><div class="flex items-center gap-3" data-v-cac96650>`);
          if (unref(step) > 1 || unref(successImg)) {
            _push2(`<button type="button" class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-300 hover:bg-neutral-800" aria-label="뒤로" data-v-cac96650><i class="fa-solid fa-arrow-left text-base" data-v-cac96650></i></button>`);
          } else if (unref(step) === 1) {
            _push2(`<div class="w-8 h-8" data-v-cac96650></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex-1 flex justify-center" data-v-cac96650><h2 class="text-sm font-semibold" data-v-cac96650>${ssrInterpolate(unref(headerTitle))}</h2></div><div class="flex items-center gap-2" data-v-cac96650>`);
          if (!unref(successImg) && (unref(step) === 2 || unref(step) === 3)) {
            _push2(`<button type="button" class="text-sm font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-40 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(!unref(files).length) ? " disabled" : ""} data-v-cac96650> 다음 </button>`);
          } else if (!unref(successImg) && unref(step) === 4) {
            _push2(`<button type="button" class="text-sm font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-40 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(!unref(files).length || unref(loading)) ? " disabled" : ""} data-v-cac96650>${ssrInterpolate(unref(loading) ? "업로드 중..." : "공유하기")}</button>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(step) === 1) {
            _push2(`<button type="button" class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800" aria-label="닫기" data-v-cac96650><i class="fa-solid fa-xmark text-base" data-v-cac96650></i></button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></header>`);
          if (unref(step) === 1 && !unref(successImg)) {
            _push2(`<div class="flex-1 flex items-center justify-center bg-[rgb(33,35,40)]" data-v-cac96650><div class="${ssrRenderClass([unref(isDragged) ? "bg-blue-900/10" : "", "w-full h-[560px] flex flex-col items-center justify-center text-center p-6 transition-colors"])}" data-v-cac96650><div class="mb-6 flex items-center justify-center" data-v-cac96650><svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-neutral-200" data-v-cac96650><g opacity="0.9" data-v-cac96650><rect x="8" y="8" width="48" height="48" rx="4" stroke="currentColor" stroke-width="2" fill="none" data-v-cac96650></rect><path d="M12 44 Q20 36, 28 44 T44 44" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" data-v-cac96650></path><circle cx="20" cy="20" r="4" fill="currentColor" data-v-cac96650></circle></g><g opacity="0.9" data-v-cac96650><rect x="24" y="24" width="48" height="48" rx="4" stroke="currentColor" stroke-width="2" fill="none" data-v-cac96650></rect><path d="M38 36 L38 52 L52 44 Z" fill="currentColor" data-v-cac96650></path></g></svg></div><p class="text-sm font-semibold text-neutral-50 mb-3" data-v-cac96650> 사진과 동영상을 여기에 끌어다 놓으세요 </p><label for="create-file-input" class="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 cursor-pointer" data-v-cac96650> 컴퓨터에서 선택 </label><input id="create-file-input" class="hidden" type="file" name="myfile" multiple accept="image/*,video/*" data-v-cac96650></div></div>`);
          } else if (unref(step) === 2 && !unref(successImg)) {
            _push2(`<div class="flex-1 flex flex-col bg-[rgb(33,35,40)]" data-v-cac96650><div class="flex-1 flex items-center justify-center" data-v-cac96650><div class="w-full h-[560px] bg-[rgb(33,35,40)] flex items-center justify-center" data-v-cac96650>`);
            if (unref(currentFile)) {
              _push2(`<img${ssrRenderAttr("src", unref(currentFile).src)} class="w-full h-full object-contain" alt="" data-v-cac96650>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div>`);
          } else if (unref(step) === 3 && !unref(successImg)) {
            _push2(`<div class="flex-1 flex flex-col lg:flex-row bg-[rgb(33,35,40)]" data-v-cac96650><div class="relative w-full lg:w-2/3 bg-[rgb(33,35,40)] flex items-center justify-center" data-v-cac96650>`);
            if (unref(currentFile)) {
              _push2(`<img${ssrRenderAttr("src", unref(currentFile).src)} class="${ssrRenderClass([unref(filterClass), "max-h-[520px] w-full object-contain"])}" alt="" data-v-cac96650>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col bg-[rgb(33,35,40)] max-h-[520px]" data-v-cac96650><div class="flex border-b border-neutral-800 text-xs font-semibold" data-v-cac96650><button type="button" class="${ssrRenderClass([unref(editTab) === "filter" ? "text-white border-b border-white" : "text-neutral-500", "flex-1 px-4 py-3 text-center"])}" data-v-cac96650> 필터 </button><button type="button" class="${ssrRenderClass([unref(editTab) === "adjust" ? "text-white border-b border-white" : "text-neutral-500", "flex-1 px-4 py-3 text-center"])}" data-v-cac96650> 조정 </button></div>`);
            if (unref(editTab) === "filter") {
              _push2(`<div class="overflow-y-auto px-4 py-3 grid grid-cols-3 gap-3" data-v-cac96650><!--[-->`);
              ssrRenderList(filterOptions, (f) => {
                _push2(`<button type="button" class="flex flex-col items-center text-xs text-neutral-300 focus:outline-none" data-v-cac96650><div class="${ssrRenderClass([unref(selectedFilter) === f.key ? "border-blue-400" : "border-transparent", "w-20 h-20 rounded-lg overflow-hidden mb-1 border"])}" data-v-cac96650>`);
                if (unref(currentFile)) {
                  _push2(`<img${ssrRenderAttr("src", unref(currentFile).src)} class="${ssrRenderClass([filterClassFor(f.key), "w-full h-full object-cover"])}" alt="" data-v-cac96650>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><span class="${ssrRenderClass(unref(selectedFilter) === f.key ? "text-white" : "text-neutral-400")}" data-v-cac96650>${ssrInterpolate(f.label)}</span></button>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="px-4 py-3 text-xs text-neutral-400" data-v-cac96650> 조정 탭은 추후 추가 예정입니다. </div>`);
            }
            _push2(`</div></div>`);
          } else if (unref(step) === 4 && !unref(successImg)) {
            _push2(`<div class="flex-1 flex flex-col lg:flex-row bg-[rgb(33,35,40)]" data-v-cac96650><div class="relative w-full lg:w-2/3 bg-[rgb(33,35,40)] flex items-center justify-center" data-v-cac96650>`);
            if (unref(currentFile)) {
              _push2(`<img${ssrRenderAttr("src", unref(currentFile).src)} class="${ssrRenderClass([unref(filterClass), "max-h-[520px] w-full object-contain"])}" alt="" data-v-cac96650>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col bg-[rgb(33,35,40)] max-h-[520px]" data-v-cac96650><div class="flex items-center gap-3 px-4 py-3" data-v-cac96650><div class="w-8 h-8 rounded-full bg-neutral-700 flex-shrink-0" data-v-cac96650></div><div class="text-sm font-semibold text-white truncate" data-v-cac96650>${ssrInterpolate(unref(auth).nickname || unref(auth).name)}</div></div><div class="flex-1 px-4 py-3 overflow-y-auto" data-v-cac96650><textarea rows="4" class="w-full resize-none border-0 bg-transparent text-sm text-white placeholder-neutral-500 outline-none" placeholder="문구 입력..." data-v-cac96650>${ssrInterpolate(unref(caption))}</textarea>`);
            if (unref(errorMessage)) {
              _push2(`<p class="mt-2 text-xs text-red-400" data-v-cac96650>${ssrInterpolate(unref(errorMessage))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="border-t border-neutral-800 divide-y divide-neutral-800" data-v-cac96650><button type="button" class="w-full flex items-center justify-between px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800/80" data-v-cac96650><span data-v-cac96650>위치 추가</span><i class="fa-solid fa-location-dot text-sm text-neutral-400" data-v-cac96650></i></button><button type="button" class="w-full flex items-center justify-between px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800/80" data-v-cac96650><span data-v-cac96650>접근성</span><i class="fa-solid fa-angle-right text-xs text-neutral-400" data-v-cac96650></i></button><button type="button" class="w-full flex items-center justify-between px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800/80" data-v-cac96650><span data-v-cac96650>고급 설정</span><i class="fa-solid fa-angle-right text-sm text-neutral-400" data-v-cac96650></i></button></div></div></div>`);
          } else {
            _push2(`<div class="flex-1 flex items-center justify-center p-10 bg-[rgb(33,35,40)]" data-v-cac96650><div class="text-center space-y-3" data-v-cac96650><div class="flex justify-center" data-v-cac96650><div class="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center" data-v-cac96650><i class="fa-solid fa-check text-2xl text-emerald-400" data-v-cac96650></i></div></div><p class="text-sm font-semibold text-neutral-50" data-v-cac96650> 업로드가 완료되었습니다 </p><p class="text-xs text-neutral-400" data-v-cac96650> 피드가 새로고침되면 새 게시물을 확인할 수 있습니다. </p></div></div>`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/CreateFeed.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-cac96650"]]), { __name: "ModalsCreateFeed" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Menu",
  __ssrInlineRender: true,
  props: {
    isMessagePage: { type: Boolean }
  },
  setup(__props) {
    const auth = useAuthStore();
    const router = useRouter();
    const route = useRoute();
    useApi();
    const isHome = computed(() => route.path === "/");
    const isReels = computed(() => route.path === "/reels");
    const isMessage = computed(() => route.path === "/message");
    const isNotifications = computed(() => route.path === "/notifications");
    const isProfile = computed(() => route.path === `/${auth.name}` || route.params?.id && route.params.id === auth.name);
    const menuList = computed(() => [
      { key: "home", label: "홈", to: "/", icon: "fa-solid fa-house", iconActive: "fa-solid fa-house", active: isHome.value },
      { key: "search", label: "검색", icon: "fa-solid fa-magnifying-glass", iconActive: "fa-solid fa-magnifying-glass", active: false },
      { key: "explore", label: "탐색 탭", icon: "fa-regular fa-compass", iconActive: "fa-solid fa-compass", active: false },
      { key: "reels", label: "릴스", icon: "fa-regular fa-circle-play", iconActive: "fa-solid fa-circle-play", active: isReels.value },
      { key: "message", label: "메시지", to: "/message", icon: "fa-regular fa-paper-plane", iconActive: "fa-solid fa-paper-plane", active: isMessage.value },
      { key: "notifications", label: "알림", icon: "fa-regular fa-heart", iconActive: "fa-solid fa-heart", active: isNotifications.value },
      { key: "create", label: "만들기", icon: "fa-solid fa-plus", iconActive: "fa-solid fa-plus", active: false },
      { key: "profile", label: "프로필", to: `/${auth.name}`, icon: "fa-regular fa-user", iconActive: "fa-solid fa-user", active: isProfile.value }
    ]);
    const searchOpen = ref(false);
    const createOpen = ref(false);
    const searchQuery = ref("");
    ref([]);
    const searchResults = ref([]);
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalsCreateFeed = __nuxt_component_0;
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: `group fixed lg:static left-0 bottom-0 lg:bottom-auto z-[100] w-full ${__props.isMessagePage ? "lg:w-[78px]" : "lg:w-[244px]"} bg-app lg:h-screen flex flex-col`
      }, _attrs))}><nav class="flex lg:flex-col items-center lg:items-stretch h-14 lg:h-auto lg:py-2 lg:px-0 border-b lg:border-b-0 border-neutral-200 dark:border-neutral-800 lg:flex-1 lg:justify-between overflow-hidden"><button type="button" class="flex items-center justify-center w-full lg:w-auto lg:justify-start px-4 lg:pl-5 lg:pr-0 py-3 lg:py-3 my-1 lg:my-1 mx-2 lg:mx-2 text-black dark:text-white hover:opacity-90"><span class="flex items-center justify-center w-6 h-6 shrink-0"><i class="fa-brands fa-instagram text-[1.7rem]"></i></span></button><div class="flex lg:flex-col flex-1 lg:flex-none lg:items-stretch lg:w-full lg:-mt-4"><!--[-->`);
      ssrRenderList(unref(menuList), (menu) => {
        _push(`<button type="button" class="flex items-center justify-center w-full lg:w-auto lg:justify-start px-4 lg:pl-5 lg:pr-0 py-3 lg:py-3 my-1 lg:my-1 mx-2 lg:mx-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-black dark:text-white"><span class="flex items-center justify-center w-6 h-6 shrink-0"><i class="${ssrRenderClass([[
          menu.active ? menu.iconActive : menu.icon,
          menu.key === "home" && !menu.active ? "opacity-50" : ""
        ], "text-2xl"])}"></i></span>`);
        if (!__props.isMessagePage) {
          _push(`<span class="hidden lg:inline text-base lg:ml-4 lg:w-0 lg:min-w-0 lg:overflow-hidden lg:opacity-0 lg:whitespace-nowrap lg:group-hover:w-auto lg:group-hover:min-w-0 lg:group-hover:overflow-visible lg:group-hover:opacity-100 lg:transition-[width,opacity] lg:duration-200 lg:ease-out">${ssrInterpolate(menu.label)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div><button type="button" class="flex items-center justify-center w-full lg:w-auto lg:justify-start px-4 lg:pl-5 lg:pr-0 py-3 lg:py-3 my-1 lg:my-1 mx-2 lg:mx-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-black dark:text-white"><span class="flex items-center justify-center w-6 h-6 shrink-0"><i class="fa-solid fa-bars text-2xl"></i></span>`);
      if (!__props.isMessagePage) {
        _push(`<span class="hidden lg:inline text-base lg:ml-4 lg:w-0 lg:min-w-0 lg:overflow-hidden lg:opacity-0 lg:whitespace-nowrap lg:group-hover:w-auto lg:group-hover:min-w-0 lg:group-hover:overflow-visible lg:group-hover:opacity-100 lg:transition-[width,opacity] lg:duration-200 lg:ease-out"> 더 보기 </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></nav>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(searchOpen)) {
          _push2(`<div class="fixed inset-0 z-[105] bg-black/25 lg:bg-transparent" aria-hidden="true"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(searchOpen)) {
          _push2(`<div class="fixed left-0 top-0 bottom-0 w-full max-w-[397px] lg:w-[397px] bg-app shadow-xl z-[110] flex flex-col border-r border-neutral-200 dark:border-neutral-800"><div class="p-4 border-b border-neutral-200 dark:border-neutral-800"><div class="flex items-center justify-between mb-4"><div class="text-xl font-bold text-black dark:text-white">검색</div><button type="button" class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="검색 닫기"><i class="fa-solid fa-xmark text-lg"></i></button></div><input${ssrRenderAttr("value", unref(searchQuery))} type="search" placeholder="검색" class="w-full h-10 px-4 rounded-lg bg-app border border-neutral-200 dark:border-neutral-700 outline-none text-black dark:text-white placeholder-neutral-500"></div><div class="flex-1 overflow-y-auto p-4">`);
          if (unref(searchResults).length) {
            _push2(`<div class="space-y-1"><!--[-->`);
            ssrRenderList(unref(searchResults), (u) => {
              _push2(`<div class="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"><div class="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-600 flex-shrink-0"></div><div><div class="text-sm font-bold text-black dark:text-white">${ssrInterpolate(u.nickname)}</div><div class="text-sm text-neutral-500 dark:text-neutral-400">${ssrInterpolate(u.name)}</div></div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<div class="text-sm text-neutral-500 dark:text-neutral-400 font-bold pb-8"> 최근 검색 내역 없음 </div>`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(ssrRenderComponent(_component_ModalsCreateFeed, {
        open: unref(createOpen),
        onClose: ($event) => createOpen.value = false,
        onCreated: ($event) => unref(router).go(0)
      }, null, _parent));
      _push(`</header>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Menu.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Menu = Object.assign(_sfc_main$1, { __name: "Menu" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const route = useRoute();
    const isMessagePage = computed(() => route.path === "/message");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen overflow-hidden bg-app text-white flex" }, _attrs))}>`);
      _push(ssrRenderComponent(Menu, {
        "is-message-page": unref(isMessagePage),
        class: "flex-shrink-0"
      }, null, _parent));
      _push(`<main class="flex-1 min-h-0 overflow-y-auto"><div class="mx-auto w-full max-w-[1400px] pb-10">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CYBuLDaZ.mjs.map
