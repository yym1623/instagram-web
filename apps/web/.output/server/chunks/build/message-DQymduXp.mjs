import { defineComponent, ref, computed, unref, watch, useSSRContext } from 'vue';
import { ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrRenderTeleport, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { c as useAuthStore, b as useApi } from './server.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MessageSend",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    allUsers: {},
    currentUserId: {}
  },
  emits: ["close", "select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const searchQuery = ref("");
    const selected = ref(null);
    const filteredUsers = computed(() => {
      if (!searchQuery.value.trim()) return props.allUsers;
      const q = searchQuery.value.trim().toLowerCase();
      return props.allUsers.filter(
        (u) => u.name.toLowerCase().includes(q) || u.nickname && u.nickname.toLowerCase().includes(q) || u.email && u.email.toLowerCase().includes(q)
      );
    });
    const canSend = computed(() => !!selected.value);
    watch(() => props.open, (isOpen) => {
      if (!isOpen) {
        selected.value = null;
        searchQuery.value = "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-[200] flex items-center justify-center bg-black/25 p-4">`);
          if (__props.open) {
            _push2(`<div class="w-full max-w-[400px] max-h-[80vh] flex flex-col rounded-xl overflow-hidden bg-[rgb(33,35,40)] border border-neutral-200 dark:border-neutral-700 shadow-xl"><div class="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800"><button type="button" class="text-black dark:text-white hover:opacity-70"><i class="fa-solid fa-xmark text-xl"></i></button><span class="font-semibold text-black dark:text-white">새 메시지</span><button type="button" class="text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed text-blue-500 dark:text-blue-400 hover:opacity-80"${ssrIncludeBooleanAttr(!unref(canSend)) ? " disabled" : ""}> 다음 </button></div><div class="p-2 border-b border-neutral-200 dark:border-neutral-800"><div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 bg-app"><i class="fa-solid fa-magnifying-glass text-neutral-400"></i><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="검색..." class="flex-1 bg-transparent border-0 outline-none text-sm text-black dark:text-white placeholder-neutral-500"></div></div><div class="flex-1 overflow-y-auto min-h-0"><div class="py-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400 px-4 pt-3"> 회원 </div><!--[-->`);
            ssrRenderList(unref(filteredUsers), (u) => {
              _push2(`<div class="${ssrRenderClass([u.id === __props.currentUserId ? "opacity-50 cursor-default" : unref(selected)?.id === u.id ? "bg-white/10" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50", "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"])}"><div class="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-600 flex-shrink-0"></div><div class="min-w-0 flex-1"><div class="text-sm font-semibold text-black dark:text-white truncate">${ssrInterpolate(u.nickname || u.name)}</div><div class="text-xs text-neutral-500 dark:text-neutral-400 truncate">${ssrInterpolate(u.name)}</div></div>`);
              if (unref(selected)?.id === u.id) {
                _push2(`<div class="text-blue-500 dark:text-blue-400"><i class="fa-solid fa-check"></i></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
            if (unref(filteredUsers).length === 0) {
              _push2(`<div class="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400"> 검색 결과가 없습니다. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modals/MessageSend.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "ModalsMessageSend" });
function useSocket() {
  {
    return { socket: null };
  }
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "message",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const { post, imageUrl } = useApi();
    const followList = ref([]);
    const allUsers = ref([]);
    const selectedUser = ref(null);
    const msgListId = ref("");
    const msgList = ref([]);
    const messageInput = ref("");
    const rightHide = ref(false);
    const leftHide = ref(false);
    const messageOpen = ref(false);
    const sendPopupOpen = ref(false);
    const messageSearchQuery = ref("");
    const { whenReady } = useSocket();
    const filteredFollowList = computed(() => {
      if (!messageSearchQuery.value.trim()) return followList.value;
      const q = messageSearchQuery.value.trim().toLowerCase();
      return followList.value.filter(
        (u) => u.name.toLowerCase().includes(q) || u.nickname && u.nickname.toLowerCase().includes(q)
      );
    });
    async function openChat(user) {
      selectedUser.value = user;
      leftHide.value = true;
      rightHide.value = false;
      messageOpen.value = true;
      const listId = await post("/messages/list", { my_idx: auth.id, idx: user.id });
      msgListId.value = listId;
      const messages = await post("/messages/select", { idx: listId });
      msgList.value = messages ?? [];
    }
    function onPopupSelect(user) {
      sendPopupOpen.value = false;
      openChat({
        id: user.id,
        name: user.name,
        email: user.email ?? ""
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalsMessageSend = __nuxt_component_0;
      _push(`<!--[--><div class="message w-full h-full min-h-0 flex overflow-hidden"><aside class="${ssrRenderClass([{ hidden: unref(leftHide) }, "w-full max-w-[350px] min-w-[280px] border-r border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden bg-app"])}"><div class="flex items-center h-[60px] px-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0"><div class="flex-1 flex items-center justify-start cursor-pointer min-w-0"><span class="font-semibold text-black dark:text-white truncate">${ssrInterpolate(unref(auth).nickname)}</span><span class="text-sm text-neutral-500 dark:text-neutral-400 ml-2">${ssrInterpolate(unref(auth).name)}</span></div><button type="button" class="shrink-0 w-10 h-10 flex items-center justify-center text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full" aria-label="새 메시지"><i class="fa-regular fa-pen-to-square text-xl"></i></button></div><div class="shrink-0 px-2 py-2"><div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 bg-app"><i class="fa-solid fa-magnifying-glass text-neutral-400 text-sm"></i><input${ssrRenderAttr("value", unref(messageSearchQuery))} type="search" placeholder="검색" class="flex-1 bg-transparent border-0 outline-none text-sm text-black dark:text-white placeholder-neutral-500"></div></div><div class="shrink-0 flex items-center justify-between px-3 py-3"><span class="text-sm font-semibold text-black dark:text-white">메시지</span><span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">요청</span></div><div class="flex-1 overflow-y-auto"><!--[-->`);
      ssrRenderList(unref(filteredFollowList), (u) => {
        _push(`<div class="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"><div class="w-14 h-14 rounded-full bg-neutral-200 dark:bg-neutral-600 flex-shrink-0"></div><div class="min-w-0 flex-1"><div class="text-sm font-semibold text-black dark:text-white truncate">${ssrInterpolate(u.nickname || u.name)}님 </div><div class="text-sm text-neutral-500 dark:text-neutral-400 truncate"> 메시지를 보내보세요 </div></div></div>`);
      });
      _push(`<!--]-->`);
      if (unref(filteredFollowList).length === 0) {
        _push(`<div class="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">${ssrInterpolate(unref(messageSearchQuery) ? "검색 결과가 없습니다." : "팔로우한 사람이 없습니다.")}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></aside>`);
      if (!unref(messageOpen)) {
        _push(`<div class="flex-1 flex items-center justify-center p-6 bg-app min-h-0"><div class="text-center"><div class="text-5xl mb-5 text-neutral-400 dark:text-neutral-500"><i class="fa-regular fa-paper-plane border-2 border-current rounded-full p-4"></i></div><div class="text-2xl font-semibold text-neutral-900 dark:text-white">내 메시지</div><div class="text-sm text-neutral-500 dark:text-neutral-400 mt-2"> 친구나 그룹에 비공개 사진과 메시지를 보내보세요. </div><button type="button" class="mt-5 h-9 px-5 text-sm font-bold text-white bg-blue-500 dark:bg-blue-600 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"> 메시지 보내기 </button></div></div>`);
      } else {
        _push(`<div class="${ssrRenderClass([{ hidden: unref(rightHide) }, "flex-1 flex flex-col min-w-0 bg-app"])}"><header class="flex items-center justify-between h-[60px] px-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0"><div class="flex items-center gap-3 min-w-0"><button class="lg:hidden shrink-0 w-10 h-10 flex items-center justify-center text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full" aria-label="뒤로"><i class="fa-solid fa-chevron-left"></i></button><span class="font-bold text-black dark:text-white truncate">${ssrInterpolate(unref(selectedUser)?.name)}</span></div><div class="flex gap-2 text-black dark:text-white shrink-0"><i class="fa-solid fa-phone cursor-pointer hover:opacity-70"></i><i class="fa-solid fa-video cursor-pointer hover:opacity-70"></i><i class="fa-solid fa-circle-info cursor-pointer hover:opacity-70"></i></div></header><div class="flex-1 overflow-y-auto p-5"><!--[-->`);
        ssrRenderList(unref(msgList), (m) => {
          _push(`<div class="${ssrRenderClass([m.my_id === unref(auth).id ? "justify-end" : "justify-start", "py-2.5 flex"])}"><div class="${ssrRenderClass([m.my_id === unref(auth).id ? "bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white" : "border border-neutral-200 dark:border-neutral-600 text-black dark:text-white", "max-w-[250px] rounded-2xl px-4 py-3 text-sm"])}">`);
          if (m.img) {
            _push(`<img${ssrRenderAttr("src", unref(imageUrl)(m.img))} class="rounded-lg max-w-[250px] mb-2" alt="">`);
          } else {
            _push(`<!---->`);
          }
          if (m.msg) {
            _push(`<span>${ssrInterpolate(m.msg)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div><div class="p-4 border-t border-neutral-200 dark:border-neutral-800 shrink-0"><div class="flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 rounded-full pl-4 pr-2 h-11 bg-transparent"><i class="fa-regular fa-face-smile text-xl cursor-pointer text-neutral-500 dark:text-neutral-400"></i><input${ssrRenderAttr("value", unref(messageInput))} type="text" placeholder="메시지 입력..." class="flex-1 border-0 outline-none bg-transparent h-8 text-sm text-black dark:text-white placeholder-neutral-400">`);
        if (unref(messageInput).length > 0) {
          _push(`<button class="text-sm font-bold text-blue-500 dark:text-blue-400 px-3 py-1.5 hover:opacity-80"> 보내기 </button>`);
        } else {
          _push(`<!--[--><i class="fa-regular fa-image text-xl cursor-pointer px-2 text-neutral-500 dark:text-neutral-400"></i><i class="fa-regular fa-heart text-xl cursor-pointer px-2 text-neutral-500 dark:text-neutral-400"></i><!--]-->`);
        }
        _push(`</div></div></div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ModalsMessageSend, {
        open: unref(sendPopupOpen),
        "all-users": unref(allUsers),
        "current-user-id": unref(auth).id,
        onClose: ($event) => sendPopupOpen.value = false,
        onSelect: onPopupSelect
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/message.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=message-DQymduXp.mjs.map
