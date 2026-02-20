import { _ as __nuxt_component_0 } from './nuxt-link-D0OzTMW9.mjs';
import { defineComponent, ref, computed, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { c as useAuthStore, d as useRouter, V as VALIDATION } from './server.mjs';
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
  __name: "signup",
  __ssrInlineRender: true,
  setup(__props) {
    const id = ref("");
    const name = ref("");
    const nickname = ref("");
    const pw = ref("");
    const errorEmail = ref("");
    const errorId = ref(false);
    const errorNickname = ref(false);
    const errorPw = ref(false);
    const loading = ref(false);
    useAuthStore();
    useRouter();
    const canSubmit = computed(() => id.value && name.value && nickname.value && pw.value && !errorId.value && !errorNickname.value && !errorPw.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><div class="relative border border-neutral-200 dark:border-neutral-700 bg-app pt-8 pb-6 px-6 rounded-sm min-h-[420px]"><h1 class="font-lobster text-4xl text-center mb-10 text-black dark:text-white"> Instagram </h1><div class="register"><form class="flex flex-col gap-2"><div class="relative"><input${ssrRenderAttr("value", unref(id))} type="text" placeholder="이메일" class="w-full h-[38px] px-2 bg-neutral-50 bg-app border border-neutral-200 dark:border-neutral-600 rounded text-xs outline-none box-border text-black dark:text-white placeholder-neutral-500"><p class="text-red-500 dark:text-red-400 text-xs pt-1" style="${ssrRenderStyle(unref(errorId) ? null : { display: "none" })}">${ssrInterpolate(unref(errorEmail) || unref(VALIDATION).EMAIL)}</p></div><div class="relative"><input${ssrRenderAttr("value", unref(name))} type="text" placeholder="성명" class="w-full h-[38px] px-2 bg-neutral-50 bg-app border border-neutral-200 dark:border-neutral-600 rounded text-xs outline-none box-border text-black dark:text-white placeholder-neutral-500"></div><div class="relative"><input${ssrRenderAttr("value", unref(nickname))} type="text" placeholder="사용자 이름" class="w-full h-[38px] px-2 bg-neutral-50 bg-app border border-neutral-200 dark:border-neutral-600 rounded text-xs outline-none box-border text-black dark:text-white placeholder-neutral-500"><p class="text-red-500 dark:text-red-400 text-xs pt-1" style="${ssrRenderStyle(unref(errorNickname) ? null : { display: "none" })}">${ssrInterpolate(unref(VALIDATION).NICKNAME)}</p></div><div class="relative"><input${ssrRenderAttr("value", unref(pw))} type="password" placeholder="비밀번호" class="w-full h-[38px] px-2 bg-neutral-50 bg-app border border-neutral-200 dark:border-neutral-600 rounded text-xs outline-none box-border text-black dark:text-white placeholder-neutral-500"><p class="text-red-500 dark:text-red-400 text-xs pt-1" style="${ssrRenderStyle(unref(errorPw) ? null : { display: "none" })}">${ssrInterpolate(unref(VALIDATION).PASSWORD_RULE)}</p></div><button type="submit" class="${ssrRenderClass([[unref(canSubmit) ? "cursor-pointer opacity-100" : "opacity-50", unref(loading) && "pointer-events-none"], "w-full h-8 text-white font-semibold text-[15px] bg-blue-500 dark:bg-blue-600 border-0 rounded disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"])}"${ssrIncludeBooleanAttr(!unref(canSubmit) || unref(loading)) ? " disabled" : ""}>`);
      if (unref(loading)) {
        _push(`<i class="fa-solid fa-spinner fa-spin text-base"></i>`);
      } else {
        _push(`<!---->`);
      }
      _push(` 가입 </button></form><p class="text-xs text-neutral-500 dark:text-neutral-400 mt-4 text-center"> 가입하면 약관 및 개인정보 처리방침에 동의하게 됩니다. </p></div></div><div class="border border-neutral-200 dark:border-neutral-700 bg-app mt-2 py-4 text-center"><p class="text-sm text-neutral-900 dark:text-white"> 계정이 있으신가요? `);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/signup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=signup-CxEbyXep.mjs.map
