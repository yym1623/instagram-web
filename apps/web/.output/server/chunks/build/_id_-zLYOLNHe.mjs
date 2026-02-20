import { _ as __nuxt_component_0 } from './nuxt-link-D0OzTMW9.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { a as useRoute, b as useApi, c as useAuthStore } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { imageUrl } = useApi();
    useAuthStore();
    computed(() => route.params.id);
    const user = ref(null);
    const userPosts = ref([]);
    const tab = ref("board");
    const settingOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "user w-full min-h-screen bg-neutral-50 bg-app py-8 px-4" }, _attrs))}><div class="max-w-[935px] mx-auto"><header class="flex flex-wrap items-center gap-8 mb-8"><div class="w-[150px] h-[150px] rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0"></div><div class="flex-1 min-w-0"><div class="flex items-center gap-4 mb-4"><h1 class="text-2xl text-neutral-900 dark:text-white">${ssrInterpolate(unref(user)?.nickname)}</h1><button class="px-4 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded text-sm font-semibold text-black dark:text-white bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"> 프로필 편집 </button><button class="relative text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"><i class="fa-solid fa-gear text-2xl"></i>`);
      if (unref(settingOpen)) {
        _push(`<div class="absolute right-0 top-full mt-1 w-48 bg-white bg-app rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-10"><div class="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-black dark:text-white">비밀번호 변경</div><div class="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-black dark:text-white">로그아웃</div><div class="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-black dark:text-white">취소</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div><div class="flex gap-8 mb-2 text-neutral-900 dark:text-white"><span><strong>게시물</strong> ${ssrInterpolate(unref(userPosts).length)}</span><span><strong>팔로워</strong> 0</span><span><strong>팔로우</strong> 0</span></div><div class="text-sm font-semibold text-neutral-900 dark:text-white">${ssrInterpolate(unref(user)?.name)}</div></div></header><nav class="flex border-t border-neutral-200 dark:border-neutral-700"><button class="${ssrRenderClass([unref(tab) === "board" ? "border-current" : "text-neutral-500 dark:text-neutral-400", "py-3 px-4 text-xs font-semibold uppercase tracking-wider border-t border-transparent -mt-px text-black dark:text-white"])}"> 게시물 </button><button class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"> 재생 </button><button class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"> 저장됨 </button><button class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"> 태그됨 </button></nav><div class="grid grid-cols-3 gap-1 mt-4"><!--[-->`);
      ssrRenderList(unref(userPosts), (p) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: p.id,
          to: `/p/${p.id}`,
          class: "aspect-square block overflow-hidden"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (p.img_cnt === 1) {
                _push2(`<img${ssrRenderAttr("src", unref(imageUrl)(p.img))} class="w-full h-full object-cover" alt=""${_scopeId}>`);
              } else {
                _push2(`<img${ssrRenderAttr("src", unref(imageUrl)(p.img.split(",")[0]))} class="w-full h-full object-cover" alt=""${_scopeId}>`);
              }
            } else {
              return [
                p.img_cnt === 1 ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: unref(imageUrl)(p.img),
                  class: "w-full h-full object-cover",
                  alt: ""
                }, null, 8, ["src"])) : (openBlock(), createBlock("img", {
                  key: 1,
                  src: unref(imageUrl)(p.img.split(",")[0]),
                  class: "w-full h-full object-cover",
                  alt: ""
                }, null, 8, ["src"]))
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-zLYOLNHe.mjs.map
