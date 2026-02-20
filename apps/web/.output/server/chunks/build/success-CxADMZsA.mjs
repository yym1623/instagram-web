import { _ as __nuxt_component_0 } from './nuxt-link-D0OzTMW9.mjs';
import { defineComponent, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@supabase/ssr';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "success",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><div class="relative border border-neutral-200 dark:border-neutral-700 bg-app pt-8 pb-6 px-6 rounded-sm min-h-[420px]"><h1 class="font-lobster text-4xl text-center mb-10 text-black dark:text-white"> Instagram </h1><div class="success"><div class="flex flex-col items-center gap-6"><div class="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center"><i class="fa-regular fa-circle-check text-4xl text-blue-500 dark:text-blue-400"></i></div><div class="text-center space-y-3"><p class="text-base text-black dark:text-white font-medium"> 회원가입이 완료되었습니다 </p><p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"> 이메일 확인이 완료되었습니다.<br> 로그인해주세요. </p></div></div></div></div><div class="border border-neutral-200 dark:border-neutral-700 bg-app mt-2 py-4 text-center"><p class="text-sm text-neutral-900 dark:text-white"> 계정이 있으신가요? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth",
        class: "font-bold text-blue-500 dark:text-blue-400 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 로그인 `);
          } else {
            return [
              createTextVNode(" 로그인 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/success.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=success-CxADMZsA.mjs.map
