import { defineComponent, ref, computed, mergeProps, unref, isRef, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderTeleport, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { b as useApi, c as useAuthStore, _ as _export_sfc, n as navigateTo } from './server.mjs';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, FreeMode } from 'swiper/modules';
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

const btnClass = "w-full h-12 flex items-center justify-center border-b border-neutral-700 text-[14px] hover:bg-neutral-700/80";
const btnClassLast = "w-full h-12 flex items-center justify-center text-[14px] hover:bg-neutral-700/80";
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "PostSettingModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    isOwnPost: { type: Boolean }
  },
  emits: ["close", "delete"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-10 flex items-center justify-center bg-black/25" }, _attrs, {
        style: __props.open ? null : { display: "none" }
      }))}><div class="bg-[rgb(33,35,40)] rounded-xl shadow-xl w-[400px] overflow-hidden border border-neutral-700"><button type="button" class="${ssrRenderClass([btnClass, "text-red-400 hover:text-red-300"])}"> 신고 </button><button type="button" class="${ssrRenderClass([btnClass, "text-red-400 hover:text-red-300"])}"> 팔로우 취소 </button><button type="button" class="${ssrRenderClass([btnClass, "text-white"])}"> 즐겨찾기에 추가 </button><button type="button" class="${ssrRenderClass([btnClass, "text-white"])}"> 게시물로 이동 </button><button type="button" class="${ssrRenderClass([btnClass, "text-white"])}"> 공유 대상... </button><button type="button" class="${ssrRenderClass([btnClass, "text-white"])}"> 링크 복사 </button><button type="button" class="${ssrRenderClass([btnClass, "text-white"])}"> 퍼가기 </button><button type="button" class="${ssrRenderClass([btnClass, "text-white"])}"> 이 계정 정보 </button>`);
      if (__props.isOwnPost) {
        _push(`<button type="button" class="${ssrRenderClass([btnClass, "text-red-400 hover:text-red-300"])}"> 삭제 </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="${ssrRenderClass([btnClassLast, "text-white"])}"> 취소 </button></div></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/PostSettingModal.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$8, { __name: "ModalsPostSettingModal" });
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "FeedCard",
  __ssrInlineRender: true,
  props: {
    post: {},
    comments: { default: () => [] },
    commentLength: { default: 0 },
    settingOpen: { type: Boolean, default: false },
    liked: { type: Boolean, default: false },
    likeCount: { default: 0 }
  },
  emits: ["openProfile", "openSetting", "closeSetting", "delete", "toggleLike", "openLikes", "openComments", "openShare", "msgPage"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { imageUrl } = useApi();
    const auth = useAuthStore();
    const isOwnPost = computed(() => {
      const post = props.post;
      if (post.user_id) return post.user_id === auth.id;
      return post.name === auth.name;
    });
    const hasImages = computed(
      () => (props.post.img_cnt ?? 0) > 0 && (props.post.img ?? "").length > 0
    );
    const isSingleImage = computed(() => (props.post.img_cnt ?? 0) === 1);
    const imageList = computed(() => (props.post.img ?? "").split(",").filter(Boolean));
    const showSwipeUi = computed(() => imageList.value.length > 1);
    const imageIndex = ref(0);
    const displayLikeCount = computed(() => {
      const n = props.liked ? Math.max(1, props.likeCount) : props.likeCount;
      if (n >= 1e4) return `${(n / 1e4).toFixed(1)}만`;
      if (n >= 1e3) return `${(n / 1e3).toFixed(1)}천`;
      return String(n);
    });
    const commentCount = computed(() => props.comments.length);
    computed(() => props.comments[0] ?? null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalsPostSettingModal = __nuxt_component_0$1;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "bg-app rounded-xl overflow-hidden w-[485px] max-w-[485px] max-h-[900px] mx-16" }, _attrs))}><header class="flex items-center justify-between min-h-[55px] py-2.5 border-b border-neutral-200 dark:border-neutral-800"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-600 cursor-pointer flex-shrink-0"></div><div><div class="text-sm font-bold text-black dark:text-white">${ssrInterpolate(__props.post.nickname)}</div><div class="text-xs text-neutral-500 dark:text-neutral-400">${ssrInterpolate(__props.post.name)}</div></div></div><button class="text-lg text-neutral-500 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer p-1"><i class="fa-solid fa-ellipsis"></i></button></header><div class="relative bg-neutral-100 bg-app w-[485px] h-[585px] overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-[4px]">`);
      if (unref(hasImages)) {
        _push(`<!--[-->`);
        if (unref(isSingleImage)) {
          _push(`<img${ssrRenderAttr("src", unref(imageUrl)(__props.post.img))} class="w-full h-full object-contain" alt="">`);
        } else {
          _push(`<div class="relative w-full h-full"><!--[-->`);
          ssrRenderList(unref(imageList), (img, i) => {
            _push(`<img${ssrRenderAttr("src", unref(imageUrl)(img))} class="absolute inset-0 w-full h-full object-contain" alt="" style="${ssrRenderStyle(i === unref(imageIndex) ? null : { display: "none" })}">`);
          });
          _push(`<!--]-->`);
          if (unref(showSwipeUi)) {
            _push(`<!--[--><button type="button" class="${ssrRenderClass([unref(imageIndex) <= 0 ? "invisible" : "", "absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white z-10"])}" aria-label="이전"><i class="fa-solid fa-chevron-left text-sm"></i></button><button type="button" class="${ssrRenderClass([unref(imageIndex) >= unref(imageList).length - 1 ? "invisible" : "", "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white z-10"])}" aria-label="다음"><i class="fa-solid fa-chevron-right text-sm"></i></button><div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5"><!--[-->`);
            ssrRenderList(unref(imageList), (_, i) => {
              _push(`<button type="button" class="${ssrRenderClass([i === unref(imageIndex) ? "bg-white" : "bg-white/50", "w-1.5 h-1.5 rounded-full transition-colors"])}"${ssrRenderAttr("aria-label", `${i + 1}번째`)}></button>`);
            });
            _push(`<!--]--></div><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<div class="w-full h-full min-h-0 flex items-center justify-center bg-neutral-800/50"><div class="text-center text-neutral-500 dark:text-neutral-400"><i class="fa-regular fa-image text-4xl mb-2 block"></i><span class="text-sm">이미지 없음</span></div></div>`);
      }
      _push(`</div><div class="border-t border-neutral-200 dark:border-neutral-800 py-4"><section class="flex items-center justify-between"><div class="flex items-center gap-3"><button type="button" class="flex items-center gap-1.5 text-black dark:text-white hover:opacity-70"><i class="${ssrRenderClass([__props.liked ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart", "text-[1.4rem]"])}" aria-label="좋아요"></i>`);
      if (__props.likeCount > 0 || __props.liked) {
        _push(`<span class="text-sm text-black dark:text-white cursor-pointer hover:underline">${ssrInterpolate(unref(displayLikeCount))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><button type="button" class="flex items-center gap-1.5 text-black dark:text-white hover:opacity-70"><i class="fa-regular fa-comment text-[1.4rem]" aria-label="댓글 달기"></i>`);
      if (unref(commentCount) > 0) {
        _push(`<span class="text-sm text-black dark:text-white cursor-pointer hover:underline">${ssrInterpolate(unref(commentCount))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><button type="button" class="flex items-center justify-center text-black dark:text-white hover:opacity-70" aria-label="공유하기"><i class="fa-regular fa-paper-plane text-[1.2rem]"></i></button></div><button type="button" class="flex items-center justify-center text-black dark:text-white hover:opacity-70 flex-shrink-0" aria-label="저장"><i class="fa-regular fa-bookmark text-[1.4rem]"></i></button></section>`);
      if (__props.post.make_write) {
        _push(`<div class="text-sm mt-3"><button type="button" class="font-semibold text-black dark:text-white hover:opacity-80 text-left">${ssrInterpolate(__props.post.nickname)}</button><span class="text-black dark:text-white">${ssrInterpolate(__props.post.make_write)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ModalsPostSettingModal, {
        open: __props.settingOpen,
        "is-own-post": unref(isOwnPost),
        onClose: ($event) => emit("closeSetting"),
        onDelete: ($event) => emit("delete", __props.post.id)
      }, null, _parent));
      _push(`</article>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/feed/FeedCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$7, { __name: "FeedCard" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "CreateStory",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(__props, { emit: __emit }) {
    useAuthStore();
    const step = ref(1);
    const isDragged = ref(false);
    const caption = ref("");
    const files = ref([]);
    const activeIndex = ref(0);
    const loading = ref(false);
    const errorMessage = ref("");
    const currentFile = computed(() => files.value[activeIndex.value] ?? null);
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-[120] flex items-center justify-center bg-black/25 px-3 py-6"><div class="${ssrRenderClass([
            unref(step) === 1 ? "w-full max-w-[620px]" : "w-full max-w-[420px] max-h-[90vh]",
            "bg-[rgb(33,35,40)] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col"
          ])}"><header class="flex items-center justify-between px-4 py-1 border-b border-neutral-800 bg-[rgb(33,35,40)] text-white shrink-0"><div class="flex items-center gap-3">`);
          if (unref(step) === 2) {
            _push2(`<button type="button" class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-300 hover:bg-neutral-800" aria-label="뒤로"><i class="fa-solid fa-arrow-left text-base"></i></button>`);
          } else {
            _push2(`<div class="w-8 h-8"></div>`);
          }
          _push2(`</div><div class="flex-1 flex justify-center"><h2 class="text-sm font-semibold">새 스토리 추가</h2></div><button type="button" class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800" aria-label="닫기"><i class="fa-solid fa-xmark text-base"></i></button></header>`);
          if (unref(step) === 1) {
            _push2(`<div class="flex-1 flex items-center justify-center bg-[rgb(33,35,40)]"><div class="${ssrRenderClass([unref(isDragged) ? "bg-blue-900/10" : "", "w-full h-[560px] flex flex-col items-center justify-center text-center p-6 transition-colors"])}"><div class="mb-6 flex items-center justify-center"><svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-neutral-200"><g opacity="0.9"><rect x="8" y="8" width="48" height="48" rx="4" stroke="currentColor" stroke-width="2" fill="none"></rect><path d="M12 44 Q20 36, 28 44 T44 44" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"></path><circle cx="20" cy="20" r="4" fill="currentColor"></circle></g><g opacity="0.9"><rect x="24" y="24" width="48" height="48" rx="4" stroke="currentColor" stroke-width="2" fill="none"></rect><path d="M38 36 L38 52 L52 44 Z" fill="currentColor"></path></g></svg></div><p class="text-sm font-semibold text-neutral-50 mb-3"> 사진과 동영상을 여기에 끌어다 놓으세요 </p><label for="create-story-file-input" class="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"> 컴퓨터에서 선택 </label><input id="create-story-file-input" class="hidden" type="file" multiple accept="image/*,video/*"></div></div>`);
          } else if (unref(step) === 2) {
            _push2(`<div class="relative flex-1 flex flex-col min-h-0 bg-[rgb(33,35,40)] overflow-hidden"><div class="relative flex-1 flex items-center justify-center bg-neutral-900 min-h-[280px] min-w-0">`);
            if (unref(currentFile)) {
              _push2(`<img${ssrRenderAttr("src", unref(currentFile).src)} class="w-full object-contain" alt="">`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="absolute right-2 top-[120px] -translate-y-1/2 flex flex-col gap-1.5"><button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white text-xs font-bold shrink-0">Aa</button><button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white shrink-0"><i class="fa-regular fa-face-smile text-sm"></i></button><button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white shrink-0"><i class="fa-solid fa-music text-sm"></i></button><button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white text-sm font-bold shrink-0">@</button><button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white shrink-0"><i class="fa-solid fa-chevron-down text-xs"></i></button></div></div><div class="px-3 py-2 border-t border-neutral-800 shrink-0"><input${ssrRenderAttr("value", unref(caption))} type="text" class="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none py-1" placeholder="캡션 추가...">`);
            if (unref(errorMessage)) {
              _push2(`<p class="mt-1 text-xs text-red-400">${ssrInterpolate(unref(errorMessage))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center gap-2 px-3 py-3 bg-[rgb(33,35,40)] border-t border-neutral-800 shrink-0"><button type="button" class="flex items-center gap-2 flex-1 min-w-0 p-2 rounded-lg hover:bg-white/5 transition-colors"><div class="w-8 h-8 rounded-full bg-neutral-600 flex-shrink-0 overflow-hidden"></div><span class="text-sm font-medium text-white truncate">내 스토리</span></button><button type="button" class="flex items-center gap-2 flex-1 min-w-0 p-2 rounded-lg hover:bg-white/5 transition-colors"><div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-star text-white text-xs"></i></div><span class="text-sm font-medium text-white truncate">친한 친구</span></button><button type="button" class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 disabled:opacity-50 shrink-0"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}><i class="fa-solid fa-arrow-right text-lg"></i></button></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/CreateStory.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$6, { __name: "ModalsCreateStory" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "LikesModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    likers: {}
  },
  emits: ["close", "openProfile"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4"><div class="bg-[rgb(33,35,40)] rounded-xl shadow-xl w-full max-w-[400px] max-h-[80vh] flex flex-col border border-neutral-700 overflow-hidden"><header class="flex items-center justify-center relative py-3 border-b border-neutral-800"><h2 class="text-base font-semibold text-white">좋아요</h2><button type="button" class="absolute right-3 w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800" aria-label="닫기"><i class="fa-solid fa-xmark text-lg"></i></button></header><div class="flex-1 overflow-y-auto"><!--[-->`);
          ssrRenderList(__props.likers, (u) => {
            _push2(`<div class="flex items-center gap-3 px-4 py-3 hover:bg-white/5"><button type="button" class="w-11 h-11 rounded-full bg-neutral-600 flex-shrink-0 overflow-hidden"></button><button type="button" class="flex-1 min-w-0 text-left"><div class="text-sm font-semibold text-white truncate">${ssrInterpolate(u.nickname)}</div>`);
            if (u.subtitle) {
              _push2(`<div class="text-xs text-neutral-400 truncate">${ssrInterpolate(u.subtitle)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button><button type="button" class="text-sm font-semibold text-blue-400 hover:text-blue-300 flex-shrink-0 px-4 py-1.5 rounded-lg"> 팔로우 </button></div>`);
          });
          _push2(`<!--]-->`);
          if (__props.likers.length === 0) {
            _push2(`<div class="py-8 text-center text-sm text-neutral-500"> 좋아요를 누른 사람이 없습니다. </div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/LikesModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$5, { __name: "ModalsLikesModal" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ShareModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    users: {}
  },
  emits: ["close", "openProfile", "selectUser"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const searchQuery = ref("");
    const filteredUsers = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      if (!q) return props.users;
      return props.users.filter(
        (u) => u.name.toLowerCase().includes(q) || u.nickname.toLowerCase().includes(q)
      );
    });
    const swiperModules = [FreeMode];
    const shareOptions = [
      { key: "link", label: "링크 복사", icon: "fa-solid fa-link" },
      { key: "facebook", label: "Facebook", icon: "fa-brands fa-facebook" },
      { key: "messenger", label: "Messenger", icon: "fa-brands fa-facebook-messenger" },
      { key: "whatsapp", label: "WhatsApp", icon: "fa-brands fa-whatsapp" },
      { key: "email", label: "Email", icon: "fa-regular fa-envelope" },
      { key: "threads", label: "Threads", icon: "fa-brands fa-threads" },
      { key: "share", label: "공유", icon: "fa-solid fa-share-nodes" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4" data-v-213f4c24><div class="bg-[rgb(33,35,40)] rounded-xl shadow-xl w-full max-w-[420px] max-h-[85vh] flex flex-col border border-neutral-700 overflow-hidden" data-v-213f4c24><header class="relative flex items-center justify-between px-3 py-3 border-b border-neutral-800 shrink-0" data-v-213f4c24><div class="w-8 h-8 flex-shrink-0" data-v-213f4c24></div><h2 class="text-base font-semibold text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" data-v-213f4c24> 공유 </h2><button type="button" class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 flex-shrink-0" aria-label="닫기" data-v-213f4c24><i class="fa-solid fa-xmark text-lg" data-v-213f4c24></i></button></header><div class="px-3 py-2 border-b border-neutral-800 shrink-0" data-v-213f4c24><div class="flex items-center gap-2 h-9 px-3 rounded-lg bg-neutral-800" data-v-213f4c24><i class="fa-solid fa-magnifying-glass text-neutral-500 text-sm" data-v-213f4c24></i><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="검색" class="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder-neutral-500" data-v-213f4c24></div></div><div class="flex-1 overflow-y-auto min-h-0 p-3" data-v-213f4c24><div class="grid grid-cols-4 gap-4" data-v-213f4c24><!--[-->`);
          ssrRenderList(unref(filteredUsers), (u) => {
            _push2(`<button type="button" class="flex flex-col items-center gap-2 text-neutral-300 hover:text-white" data-v-213f4c24><div class="w-14 h-14 rounded-full bg-neutral-600 flex-shrink-0 overflow-hidden" data-v-213f4c24></div><span class="text-xs truncate w-full text-center" data-v-213f4c24>${ssrInterpolate(u.nickname || u.name)}</span></button>`);
          });
          _push2(`<!--]--></div>`);
          if (unref(filteredUsers).length === 0) {
            _push2(`<p class="text-sm text-neutral-500 text-center py-6" data-v-213f4c24> 검색 결과가 없습니다. </p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="border-t border-neutral-800 p-3 shrink-0" data-v-213f4c24>`);
          _push2(ssrRenderComponent(unref(Swiper), {
            class: "share-swiper",
            modules: swiperModules,
            "slides-per-view": "auto",
            "space-between": 12,
            "free-mode": true
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`<!--[-->`);
                ssrRenderList(shareOptions, (opt) => {
                  _push3(ssrRenderComponent(unref(SwiperSlide), {
                    key: opt.key,
                    class: "!w-[72px] flex flex-col items-center gap-1.5"
                  }, {
                    default: withCtx((_2, _push4, _parent3, _scopeId2) => {
                      if (_push4) {
                        _push4(`<button type="button" class="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-white hover:bg-neutral-600 flex-shrink-0" data-v-213f4c24${_scopeId2}><i class="${ssrRenderClass([opt.icon, "text-lg"])}" data-v-213f4c24${_scopeId2}></i></button><span class="text-[10px] text-neutral-400 truncate w-full text-center" data-v-213f4c24${_scopeId2}>${ssrInterpolate(opt.label)}</span>`);
                      } else {
                        return [
                          createVNode("button", {
                            type: "button",
                            class: "w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-white hover:bg-neutral-600 flex-shrink-0"
                          }, [
                            createVNode("i", {
                              class: [opt.icon, "text-lg"]
                            }, null, 2)
                          ]),
                          createVNode("span", { class: "text-[10px] text-neutral-400 truncate w-full text-center" }, toDisplayString(opt.label), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                });
                _push3(`<!--]-->`);
              } else {
                return [
                  (openBlock(), createBlock(Fragment, null, renderList(shareOptions, (opt) => {
                    return createVNode(unref(SwiperSlide), {
                      key: opt.key,
                      class: "!w-[72px] flex flex-col items-center gap-1.5"
                    }, {
                      default: withCtx(() => [
                        createVNode("button", {
                          type: "button",
                          class: "w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-white hover:bg-neutral-600 flex-shrink-0"
                        }, [
                          createVNode("i", {
                            class: [opt.icon, "text-lg"]
                          }, null, 2)
                        ]),
                        createVNode("span", { class: "text-[10px] text-neutral-400 truncate w-full text-center" }, toDisplayString(opt.label), 1)
                      ]),
                      _: 2
                    }, 1024);
                  }), 64))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/ShareModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-213f4c24"]]), { __name: "ModalsShareModal" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "PostCommentModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    post: {},
    comments: {},
    comment: {},
    liked: { type: Boolean, default: false },
    likeCount: { default: 0 }
  },
  emits: ["close", "update:comment", "submitComment", "openProfile", "msgPage"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { imageUrl } = useApi();
    const hasImages = computed(
      () => (props.post?.img_cnt ?? 0) > 0 && (props.post?.img ?? "").length > 0
    );
    const isSingleImage = computed(() => (props.post?.img_cnt ?? 0) === 1);
    const imageList = computed(
      () => (props.post?.img ?? "").split(",").filter(Boolean)
    );
    const imageIndex = ref(0);
    watch(
      () => props.open,
      (v) => {
        if (v) imageIndex.value = 0;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open && __props.post) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4"><div class="bg-[rgb(33,35,40)] rounded-b-xl shadow-2xl w-[90vw] max-w-[950px] h-[90vh] flex overflow-hidden border border-neutral-700 flex-col lg:flex-row"><div class="relative w-full lg:w-[450px] lg:flex-shrink-0 flex flex-col bg-[rgb(33,35,40)] min-h-0">`);
          if (unref(hasImages)) {
            _push2(`<!--[-->`);
            if (unref(isSingleImage)) {
              _push2(`<img${ssrRenderAttr("src", unref(imageUrl)(__props.post.img))} class="w-full h-full object-contain flex-1 min-h-0" alt="">`);
            } else {
              _push2(`<div class="relative flex-1 min-h-0 overflow-hidden"><!--[-->`);
              ssrRenderList(unref(imageList), (img, i) => {
                _push2(`<img${ssrRenderAttr("src", unref(imageUrl)(img))} class="${ssrRenderClass([i === unref(imageIndex) ? "z-10" : "z-0 opacity-0 pointer-events-none", "absolute inset-0 w-full h-full object-contain"])}" alt="">`);
              });
              _push2(`<!--]-->`);
              if (unref(imageIndex) > 0) {
                _push2(`<button type="button" class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white"><i class="fa-solid fa-chevron-left"></i></button>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(imageIndex) < unref(imageList).length - 1) {
                _push2(`<button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white"><i class="fa-solid fa-chevron-right"></i></button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
            _push2(`<!--]-->`);
          } else {
            _push2(`<div class="flex-1 min-h-[200px] flex items-center justify-center bg-neutral-800/50"><span class="text-neutral-500 text-sm">이미지 없음</span></div>`);
          }
          _push2(`</div><div class="w-full lg:w-[500px] lg:flex-shrink-0 border-t lg:border-t-0 lg:border-l border-neutral-700 flex flex-col bg-[rgb(33,35,40)] min-h-0"><div class="flex items-center gap-3 p-4 border-b border-neutral-700 shrink-0"><button type="button" class="w-9 h-9 rounded-full bg-neutral-600 flex-shrink-0 overflow-hidden"></button><div class="min-w-0 flex-1 text-left"><div class="text-sm font-semibold text-white truncate">${ssrInterpolate(__props.post.nickname)}</div><div class="text-xs text-neutral-400 truncate">오리지널 오디오</div></div><button type="button" class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-white shrink-0" aria-label="더보기"><i class="fa-solid fa-ellipsis"></i></button></div><div class="flex-1 overflow-y-auto min-h-0 px-4 py-3"><!--[-->`);
          ssrRenderList(__props.comments, (c) => {
            _push2(`<div class="flex gap-3 py-3 border-b border-neutral-800/50 last:border-0"><div class="w-8 h-8 rounded-full bg-neutral-600 flex-shrink-0"></div><div class="min-w-0 flex-1"><div class="text-sm"><span class="font-semibold text-white">${ssrInterpolate(c.user_nickname)}</span><span class="text-neutral-300">${ssrInterpolate(c.comment)}</span></div><div class="flex items-center gap-3 mt-1 text-xs text-neutral-500"><span>9시간</span><button type="button" class="hover:underline">좋아요 0개</button><button type="button" class="hover:underline">답글 달기</button></div></div><button type="button" class="self-start text-neutral-400 hover:text-white shrink-0"><i class="fa-regular fa-heart text-sm"></i></button></div>`);
          });
          _push2(`<!--]--></div><div class="p-3 shrink-0"><section class="flex items-center justify-between"><div class="flex items-center gap-3"><button type="button" class="flex items-center gap-1.5 text-white hover:opacity-70"><i class="${ssrRenderClass([__props.liked ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart", "text-[1.4rem]"])}" aria-label="좋아요"></i></button><button type="button" class="flex items-center gap-1.5 text-white hover:opacity-70"><i class="fa-regular fa-comment text-[1.4rem]" aria-label="댓글 달기"></i></button><button type="button" class="flex items-center justify-center text-white hover:opacity-70" aria-label="공유하기"><i class="fa-regular fa-paper-plane text-[1.2rem]"></i></button></div><button type="button" class="flex items-center justify-center text-white hover:opacity-70 flex-shrink-0" aria-label="저장"><i class="fa-regular fa-bookmark text-[1.4rem]"></i></button></section><div class="mt-3 flex flex-col gap-0.5 text-sm text-white"><span class="font-semibold">좋아요 ${ssrInterpolate(__props.likeCount)}개</span><span class="text-neutral-500">9시간 전</span></div></div><div class="flex items-center gap-2 px-3 py-2 border-t border-neutral-700 shrink-0"><button type="button" class="flex items-center justify-center w-9 h-9 rounded-full text-neutral-400 hover:text-white shrink-0" aria-label="이모지"><i class="fa-regular fa-face-smile text-xl"></i></button><input${ssrRenderAttr("value", __props.comment)} type="text" placeholder="댓글 달기..." class="flex-1 min-w-0 py-2 bg-transparent border-0 outline-none text-sm text-white placeholder-neutral-500"><button type="button" class="${ssrRenderClass([__props.comment ? "text-blue-400 hover:opacity-80" : "text-neutral-500", "font-semibold text-sm shrink-0 disabled:opacity-40"])}"${ssrIncludeBooleanAttr(!__props.comment) ? " disabled" : ""}> 게시 </button></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/PostCommentModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$3, { __name: "ModalsPostCommentModal" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "RightSidebar",
  __ssrInlineRender: true,
  props: {
    users: {}
  },
  emits: ["openProfile"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const auth = useAuthStore();
    const otherUsers = computed(
      () => props.users.filter((u) => u.id !== auth.id)
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "hidden lg:block w-full" }, _attrs))}><div class="flex items-center gap-3"><button type="button" class="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-600 cursor-pointer flex-shrink-0"></button><button type="button" class="flex flex-col min-w-0 flex-1 text-left"><span class="text-sm font-bold text-black dark:text-white leading-tight truncate block">${ssrInterpolate(unref(auth).nickname)}</span><span class="text-xs text-neutral-500 dark:text-neutral-400 leading-tight truncate block">${ssrInterpolate(unref(auth).name)}</span></button><button type="button" class="text-[12px] font-semibold text-blue-500 dark:text-blue-400 hover:opacity-80 flex-shrink-0"> 전환 </button></div><section class="mt-2"><div class="flex justify-between items-center py-2"><span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">회원님을 위한 추천</span><button type="button" class="text-xs font-semibold text-black dark:text-white hover:opacity-80"> 모두 보기 </button></div><!--[-->`);
      ssrRenderList(unref(otherUsers), (u) => {
        _push(`<div class="flex items-center py-3 gap-3"><button type="button" class="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-600 cursor-pointer flex-shrink-0"></button><div class="flex-1 min-w-0"><div class="text-sm font-bold text-black dark:text-white truncate">${ssrInterpolate(u.nickname)}</div><div class="text-xs text-neutral-500 dark:text-neutral-400 truncate">${ssrInterpolate(u.name)}님을 위한 추천 </div></div><button type="button" class="text-[12px] font-semibold text-blue-500 dark:text-blue-400 hover:opacity-80 flex-shrink-0"> 팔로우 </button></div>`);
      });
      _push(`<!--]--></section><footer class="mt-8 text-[11px] text-neutral-500 leading-relaxed space-y-1"><p class="flex flex-wrap gap-x-2 gap-y-0"><span>소개</span><span>도움말</span><span>홍보 센터</span><span>API</span><span>채용 정보</span></p><p class="flex flex-wrap gap-x-2 gap-y-0"><span>개인정보처리방침</span><span>약관</span><span>위치</span><span>언어</span><span>Meta Verified</span></p><p class="pt-2">© 2026 INSTAGRAM FROM META</p></footer></aside>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/feed/RightSidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const RightSidebar = Object.assign(_sfc_main$2, { __name: "FeedRightSidebar" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "StoriesBar",
  __ssrInlineRender: true,
  props: {
    currentNickname: {},
    users: {},
    usersWithStories: { default: () => [] }
  },
  emits: ["openProfile", "addStory"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const modules = [Navigation];
    const swiperRef = ref(null);
    const canGoLeft = ref(false);
    const canGoRight = ref(false);
    const storyUsers = computed(() => props.usersWithStories ?? []);
    const hasStoryUsers = computed(() => storyUsers.value.length > 0);
    function updateNav(s) {
      if (!s) return;
      canGoLeft.value = !s.isBeginning;
      canGoRight.value = !s.isEnd;
    }
    function onSwiper(s) {
      swiperRef.value = s;
      updateNav(s);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-xl px-4 py-3 min-h-[140px] flex items-center relative" }, _attrs))} data-v-9e993def>`);
      if (unref(hasStoryUsers) && unref(canGoLeft)) {
        _push(`<button type="button" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-app/90 border border-neutral-600 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-600/80 transition-colors shadow-lg" aria-label="이전" data-v-9e993def><i class="fa-solid fa-chevron-left text-[10px]" data-v-9e993def></i></button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasStoryUsers) && unref(canGoRight)) {
        _push(`<button type="button" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-app/90 border border-neutral-600 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-600/80 transition-colors shadow-lg" aria-label="다음" data-v-9e993def><i class="fa-solid fa-chevron-right text-[10px]" data-v-9e993def></i></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([unref(hasStoryUsers) ? "px-8" : "", "w-full overflow-hidden"])}" data-v-9e993def>`);
      if (!unref(hasStoryUsers)) {
        _push(`<button type="button" class="flex-shrink-0 flex flex-col items-center cursor-pointer focus:outline-none" data-v-9e993def><div class="w-[74px] h-[74px] rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center ring-2 ring-white dark:ring-black bg-app" data-v-9e993def><i class="fa-solid fa-plus text-white text-xl" data-v-9e993def></i></div><span class="text-[12px] text-neutral-600 dark:text-neutral-300 mt-1.5 truncate max-w-[92px]" data-v-9e993def> 추가하기 </span></button>`);
      } else {
        _push(ssrRenderComponent(unref(Swiper), {
          modules,
          "slides-per-view": 6,
          "space-between": 12,
          class: "stories-swiper",
          onSwiper,
          onSlideChange: () => updateNav(unref(swiperRef))
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(unref(storyUsers), (u) => {
                _push2(ssrRenderComponent(unref(SwiperSlide), {
                  key: u.id
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<button type="button" class="w-full flex flex-col items-center cursor-pointer focus:outline-none py-1" data-v-9e993def${_scopeId2}><div class="w-[74px] h-[74px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px] flex items-center justify-center ring-2 ring-white dark:ring-black flex-shrink-0" data-v-9e993def${_scopeId2}><div class="w-[70px] h-[70px] rounded-full bg-app ring-2 ring-white dark:ring-black" data-v-9e993def${_scopeId2}></div></div><span class="text-[12px] text-neutral-600 dark:text-neutral-300 mt-1.5 truncate max-w-[92px] block" data-v-9e993def${_scopeId2}>${ssrInterpolate(u.nickname)}</span></button>`);
                    } else {
                      return [
                        createVNode("button", {
                          type: "button",
                          class: "w-full flex flex-col items-center cursor-pointer focus:outline-none py-1",
                          onClick: ($event) => emit("openProfile", u.name)
                        }, [
                          createVNode("div", { class: "w-[74px] h-[74px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px] flex items-center justify-center ring-2 ring-white dark:ring-black flex-shrink-0" }, [
                            createVNode("div", { class: "w-[70px] h-[70px] rounded-full bg-app ring-2 ring-white dark:ring-black" })
                          ]),
                          createVNode("span", { class: "text-[12px] text-neutral-600 dark:text-neutral-300 mt-1.5 truncate max-w-[92px] block" }, toDisplayString(u.nickname), 1)
                        ], 8, ["onClick"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(storyUsers), (u) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: u.id
                  }, {
                    default: withCtx(() => [
                      createVNode("button", {
                        type: "button",
                        class: "w-full flex flex-col items-center cursor-pointer focus:outline-none py-1",
                        onClick: ($event) => emit("openProfile", u.name)
                      }, [
                        createVNode("div", { class: "w-[74px] h-[74px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px] flex items-center justify-center ring-2 ring-white dark:ring-black flex-shrink-0" }, [
                          createVNode("div", { class: "w-[70px] h-[70px] rounded-full bg-app ring-2 ring-white dark:ring-black" })
                        ]),
                        createVNode("span", { class: "text-[12px] text-neutral-600 dark:text-neutral-300 mt-1.5 truncate max-w-[92px] block" }, toDisplayString(u.nickname), 1)
                      ], 8, ["onClick"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/feed/StoriesBar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const StoriesBar = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-9e993def"]]), { __name: "FeedStoriesBar" });
const mockFeed = {
  row: [
    {
      id: "p1",
      user_id: "u1",
      nickname: "목업닉네임",
      name: "mock_user_1",
      img_cnt: 1,
      img: "/placeholder.jpg",
      make_write: "목업 피드 데이터입니다."
    }
  ],
  comment: [
    {
      id: "c1",
      make_id: "p1",
      user_nickname: "댓글유저",
      comment: "목업 댓글입니다."
    }
  ],
  commentLength: [
    {
      id: "c1",
      make_id: "p1",
      user_nickname: "댓글유저",
      comment: "목업 댓글입니다."
    }
  ]
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { get, post } = useApi();
    const auth = useAuthStore();
    const userList = ref(null);
    const usersList = ref([]);
    const comment = ref("");
    const openPostId = ref(null);
    const createStoryOpen = ref(false);
    const likesModalOpen = ref(false);
    const commentModalOpen = ref(false);
    const shareModalOpen = ref(false);
    const selectedPostId = ref(null);
    const likedByPost = ref({});
    const likeCountByPost = ref({});
    const selectedPost = computed(() => {
      if (!selectedPostId.value || !userList.value?.row) return null;
      const row = userList.value.row;
      return row.find((p) => p.id === selectedPostId.value) ?? null;
    });
    const selectedPostComments = computed(() => {
      if (!selectedPostId.value || !userList.value?.comment) return [];
      const comments = userList.value.comment;
      return comments.filter((c) => c.make_id === selectedPostId.value);
    });
    const likersForModal = ref([]);
    async function loadFeed() {
      try {
        const res = await get("/posts/feed");
        if (!res || !Array.isArray(res.row) || res.row.length === 0) {
          userList.value = mockFeed;
        } else {
          userList.value = res;
        }
      } catch {
        userList.value = mockFeed;
      }
    }
    function myPage(name) {
      navigateTo(`/${name}`);
    }
    async function commentBtn(idx) {
      await post("/comments", { idx, comment: comment.value, nickname: auth.nickname, user_id: auth.id });
      comment.value = "";
      commentModalOpen.value = false;
      selectedPostId.value = null;
      await loadFeed();
    }
    function toggleLike(postId) {
      const cur = likedByPost.value[postId] ?? false;
      const count = likeCountByPost.value[postId] ?? 0;
      likedByPost.value[postId] = !cur;
      likeCountByPost.value[postId] = cur ? Math.max(0, count - 1) : count + 1;
    }
    function openLikesModal(postId) {
      selectedPostId.value = postId;
      likersForModal.value = [];
      likesModalOpen.value = true;
    }
    function openCommentModal(postId) {
      selectedPostId.value = postId;
      commentModalOpen.value = true;
    }
    async function boardDelete(idx) {
      await post("/posts/delete", { make_idx: idx });
      await loadFeed();
    }
    function msgPage() {
      navigateTo("/message");
    }
    function openShareModal(_postId) {
      shareModalOpen.value = true;
    }
    function onShareSelectUser(_user) {
      shareModalOpen.value = false;
      navigateTo("/message");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FeedCard = __nuxt_component_0;
      const _component_ModalsCreateStory = __nuxt_component_1;
      const _component_ModalsLikesModal = __nuxt_component_2;
      const _component_ModalsShareModal = __nuxt_component_3;
      const _component_ModalsPostCommentModal = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full h-full min-h-full flex flex-col lg:flex-row gap-8" }, _attrs))}><div class="w-full max-w-[630px] min-w-0 flex flex-col gap-4">`);
      _push(ssrRenderComponent(StoriesBar, {
        "current-nickname": unref(auth).nickname,
        users: unref(usersList),
        onOpenProfile: myPage,
        onAddStory: ($event) => createStoryOpen.value = true
      }, null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(userList)?.row ?? [], (post2) => {
        _push(ssrRenderComponent(_component_FeedCard, {
          key: post2.id,
          post: post2,
          comments: (unref(userList)?.comment ?? []).filter((c) => c.make_id === post2.id),
          "setting-open": unref(openPostId) === post2.id,
          liked: unref(likedByPost)[post2.id] ?? false,
          "like-count": unref(likeCountByPost)[post2.id] ?? 0,
          onOpenProfile: myPage,
          onOpenSetting: ($event) => openPostId.value = post2.id,
          onCloseSetting: ($event) => openPostId.value = null,
          onDelete: boardDelete,
          onToggleLike: toggleLike,
          onOpenLikes: openLikesModal,
          onOpenComments: openCommentModal,
          onOpenShare: openShareModal,
          onMsgPage: msgPage
        }, null, _parent));
      });
      _push(`<!--]--></div><div class="hidden lg:block w-full max-w-[320px] flex-shrink-0 ml-6 my-6 mt-10 pl-6">`);
      _push(ssrRenderComponent(RightSidebar, {
        users: unref(usersList),
        onOpenProfile: myPage
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ModalsCreateStory, {
        open: unref(createStoryOpen),
        onClose: ($event) => createStoryOpen.value = false,
        onCreated: ($event) => createStoryOpen.value = false
      }, null, _parent));
      _push(ssrRenderComponent(_component_ModalsLikesModal, {
        open: unref(likesModalOpen),
        likers: unref(likersForModal),
        onClose: ($event) => {
          likesModalOpen.value = false;
          selectedPostId.value = null;
        },
        onOpenProfile: myPage
      }, null, _parent));
      _push(ssrRenderComponent(_component_ModalsShareModal, {
        open: unref(shareModalOpen),
        users: unref(usersList),
        onClose: ($event) => shareModalOpen.value = false,
        onOpenProfile: myPage,
        onSelectUser: onShareSelectUser
      }, null, _parent));
      _push(ssrRenderComponent(_component_ModalsPostCommentModal, {
        open: unref(commentModalOpen),
        post: unref(selectedPost),
        comments: unref(selectedPostComments),
        liked: unref(selectedPostId) ? !!unref(likedByPost)[unref(selectedPostId)] : false,
        "like-count": unref(selectedPostId) ? unref(likeCountByPost)[unref(selectedPostId)] ?? 0 : 0,
        comment: unref(comment),
        "onUpdate:comment": ($event) => isRef(comment) ? comment.value = $event : null,
        onClose: ($event) => {
          commentModalOpen.value = false;
          selectedPostId.value = null;
        },
        onSubmitComment: commentBtn,
        onOpenProfile: myPage,
        onMsgPage: msgPage
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dq3ckFRH.mjs.map
