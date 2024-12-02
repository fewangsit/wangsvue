<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
import { JSONContent } from '@tiptap/vue-3';
import { PostImage } from '../editor/Editor.vue.d';
import { CommentServices } from 'lib/services/comment.service';
import { getBaseURL } from 'lib/utils/getBaseURL.util';
import { getNestedProperyValue } from 'lib/utils';
import { CommentBlockProps, Reaction } from './Comment.vue.d';

import Editor from '../editor/Editor.vue';
import Icon from '../icon/Icon.vue';
import Image from '../image/Image.vue';
import Button from '../button/Button.vue';
import OverlayPanel from '../overlaypanel/OverlayPanel.vue';
import OverlayPanelClass from '../overlaypanel/OverlayPanel.vue.d';
import emojiByGroupJson from '../../assets/json/emoji-by-group.json';
import InputText from '../inputtext/InputText.vue';
import Skeleton from 'primevue/skeleton';

const props = withDefaults(defineProps<CommentBlockProps>(), {
  replies: () => {
    return [];
  },
  useReactions: true,
  useReplies: true,
  useTimeStamp: true,
});

const replyMessageVisibility = ref(false);
const mentionedList = ref<string[]>();
const editorInputVisibility = ref(false);
const editorReplyData = ref<JSONContent>();
const editorTypeInput = ref<'edit' | 'reply'>();
const emojiOverlayPanel = ref<OverlayPanelClass>();
const emojiByGroup = ref(emojiByGroupJson);
const emojiQuerySearch = ref<string>('');
const isLoading = shallowRef<boolean>(false);
const isLoadingEmojiContainer = shallowRef<boolean>(false);
const isLoadingReactions = shallowRef<boolean>(false);

const setReplyMessageVisibility = (): void => {
  replyMessageVisibility.value = !replyMessageVisibility.value;
};

const setEditorInputVisibility = (): void => {
  editorInputVisibility.value = !editorInputVisibility.value;
};

const postComment = async (): Promise<void> => {
  if (editorReplyData.value === undefined) {
    return;
  }
  try {
    await CommentServices.postComments({
      content: editorReplyData.value,
      objectId: props.objectId,
      type: props.commentType,
      replyToId: props._id,
      mentions: mentionedList.value,
    });
    editorReplyData.value = [];
    setEditorInputVisibility();
  } catch (error) {
    console.error(error);
  }
};

const putCommentsById = async (): Promise<void> => {
  try {
    await CommentServices.putCommentsById(props._id, {
      content: editorReplyData.value ?? {},
    });
    editorReplyData.value = [];
    setEditorInputVisibility();
  } catch (error) {
    console.error(error);
  }
};

const initialPutCommentsById = (): void => {
  editorTypeInput.value = 'edit';
  editorReplyData.value = props.content;
  editorInputVisibility.value = !editorInputVisibility.value;
};

const initialPostCommentsById = (): void => {
  editorTypeInput.value = 'reply';
  editorReplyData.value = [];
  editorInputVisibility.value = !editorInputVisibility.value;
};

const uploadImage = async (value: PostImage): Promise<void> => {
  try {
    const { data } = await CommentServices.postCommentsUpload({
      images: [value.image],
    });
    value.setImageCb(`${getBaseURL('APP_FILES_API')}/files${data.data[0]}`);
  } catch (error) {
    console.error(error);
  }
};

const uploadComment = async (): Promise<void> => {
  switch (editorTypeInput.value) {
    case 'edit':
      putCommentsById();
      break;
    case 'reply':
      postComment();
      break;
  }
};

const postReactions = async (
  commentId: string,
  emoji: string,
): Promise<void> => {
  isLoadingReactions.value = !isLoadingReactions.value;
  try {
    await CommentServices.postCommentsReactionsByCommentId(commentId, {
      emoji,
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoadingReactions.value = !isLoadingReactions.value;
  }
};

const searchEmoji = (): void => {
  if (emojiQuerySearch.value === undefined) {
    return;
  }
  if (emojiQuerySearch.value.length === 0) {
    emojiByGroup.value = emojiByGroupJson;
  } else {
    emojiByGroupJson.forEach((item) => {
      return item.emojis.forEach((emoji) => {
        if (
          emoji.name
            .toLowerCase()
            .includes(emojiQuerySearch.value.toLowerCase())
        ) {
          emojiByGroup.value = [
            {
              name: item.name,
              slug: item.slug,
              emojis: [emoji],
            },
          ];
        }
      });
    });
  }
};

const deleteReaction = async (
  commentId: string,
  reaction: Reaction,
): Promise<void> => {
  const isMyReaction = reaction.users.some(
    (value) => value._id === props.user._id,
  );
  if (isMyReaction) {
    try {
      await CommentServices.deleteCommentsReactionsByCommentId(commentId);
    } catch (error) {
      console.error(error);
    }
  }
};

watch(emojiQuerySearch, () => {
  isLoadingEmojiContainer.value = !isLoadingEmojiContainer.value;
  searchEmoji();
  isLoadingEmojiContainer.value = !isLoadingEmojiContainer.value;
});

watch(props, () => {
  isLoading.value = !isLoading.value;
  setTimeout(() => {
    isLoading.value = !isLoading.value;
  }, 100);
});
</script>

<template>
  <div>
    <div class="flex gap-1 items-center">
      <Image
        :src="getNestedProperyValue(sender, 'profilePicture') as string"
        class="w-[30px] h-[30px]"
        rounded
      />
      <p class="text-grayscale-900 !font-semibold text-xs">{{ sender.name }}</p>
      <p v-if="useTimeStamp" class="text-[8px] leading-4 text-general-300">
        {{ createdAt }}
      </p>
    </div>

    <div class="ml-[34px]">
      <div v-if="!isLoading">
        <Editor :model-value="content" editor-state="readonly" />
      </div>
      <div v-else>
        <Skeleton height="4rem" width="10rem" />
      </div>
    </div>

    <div
      v-if="!!useReactions || !!useReplies"
      class="ml-[34px] mt-1 flex gap-2 items-center text-primary-400"
    >
      <div v-if="!isLoadingReactions" class="flex gap-1 items-center">
        <div v-if="reactions.length > 0" class="flex items-center gap-1">
          <div
            :key="index"
            v-for="(reaction, index) in reactions"
            :class="[
              `${reaction.users.some((value) => value._id === props.user._id) ? 'border-[1px] border-primary-400' : ''}`,
              'flex gap-[1px] items-center bg-grayscale-200 px-[1px] py-[0.5px] rounded-md cursor-pointer',
            ]"
            @click="deleteReaction(props._id, reaction)"
          >
            <p>{{ reaction.emoji }}</p>
            <p>{{ reaction.count }}</p>
          </div>
        </div>

        <Icon
          v-if="useReactions"
          @click="emojiOverlayPanel?.toggle($event)"
          icon="emotion-happy-line"
          severity="primary"
        />
      </div>

      <p v-if="useReplies" class="text-grayscale-900 text-xs font-medium">|</p>
      <p
        v-if="props.user._id !== props.sender._id && useReplies"
        @click="initialPostCommentsById"
        class="text-[10px] leading-4 font-medium"
      >
        Balas
      </p>
      <p
        v-else
        @click="initialPutCommentsById"
        class="text-[10px] leading-4 font-medium"
      >
        Edit
      </p>
    </div>

    <div v-if="editorInputVisibility" class="ml-[34px] my-2">
      <Editor
        v-model:mentioned-list="mentionedList"
        v-model:model-value="editorReplyData"
        :fetch-mention-suggestion-function="fetchMentionSuggestionFunction"
        @post-image-local="uploadImage"
      />

      <div class="mt-2 flex gap-1">
        <Button @click="uploadComment" label="Kirim" severity="success" />

        <Button
          @click="setEditorInputVisibility"
          label="Batal"
          severity="secondary"
          text
        />
      </div>
    </div>

    <div
      v-if="replies.length > 0 && useReplies"
      class="ml-[34px] mt-1 flex flex-col gap-2"
    >
      <div @click="setReplyMessageVisibility" class="flex gap-2 items-center">
        <Icon class="w-[18px] h-[18px]" icon="arrow-down" />
        <p class="text-xs !font-medium text-grayscale-900">
          {{ replies.length }} Balasan
        </p>
      </div>

      <div v-if="replyMessageVisibility">
        <CommentBlock
          :key="comment._id"
          v-for="comment in props.replies"
          v-bind="comment"
          :comment-type="commentType"
          :fetch-mention-suggestion-function="fetchMentionSuggestionFunction"
          :user="props.user"
        />
      </div>
    </div>

    <OverlayPanel ref="emojiOverlayPanel">
      <div class="w-96 h-40 py-1 overflow-hidden">
        <InputText
          v-model="emojiQuerySearch"
          class="px-2 pt-1"
          placeholder="Cari Emoji"
        />
        <div
          v-if="!isLoadingEmojiContainer"
          class="flex flex-col h-32 overflow-y-scroll my-2 pl-1"
        >
          <div :key="index" v-for="(items, index) in emojiByGroup">
            <p class="p-1">{{ items.name }}</p>
            <div class="flex flex-wrap gap-1">
              <div
                :key="emojiIndex"
                v-for="(emoji, emojiIndex) in items.emojis"
              >
                <p
                  @click="postReactions(props._id, emoji.emoji)"
                  class="p-[1px] cursor-pointer"
                >
                  {{ emoji.emoji }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>
