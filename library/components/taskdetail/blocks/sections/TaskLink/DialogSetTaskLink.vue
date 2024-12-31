<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import { FormPayload } from 'lib/components/form/Form.vue.d';
import InputText from 'lib/components/inputtext/InputText.vue';
import InputURL from 'lib/components/inputurl/InputURL.vue';
import { MenuItem } from 'lib/components/menuitem';
import TabMenu from 'lib/components/tabmenu/TabMenu.vue';
import { EditTaskLinkDTO } from 'lib/dto/task.dto';
import { TaskLinkServices } from 'wangsit-api-services';
import { TaskLink, TaskLinkURLType } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import { computed, inject, Ref, ref, shallowRef } from 'vue';
import { DetailTaskEmits } from 'lib/components/taskdetail/TaskDetail.vue.d';

const toast = useToast();

const taskId = inject<Ref<string>>('taskId');
const refreshTaskHandler =
  inject<(eventName: keyof DetailTaskEmits, id?: string) => Promise<void>>(
    'refreshTaskHandler',
  );

const props = withDefaults(
  defineProps<{
    type?: 'link' | 'repositori' | 'microservices';
    initialValue?: TaskLink;
  }>(),
  {
    type: 'link',
    initialValue: undefined,
  },
);

/**
 *
 * - \s*\/?\s* There may be spaces before the name of the tag
 * - (iframe)\b Matches only the whole tag name
 * - .*?> Matching everything to the character >
 *
 * @see <https://stackoverflow.com/questions/59465583/regex-to-whitelist-html-tags>
 */
const whitelistIframeTag = /<\s*\/?\s*(iframe)\b.*?>/;

const visible = defineModel<boolean>('visible', { required: true });

const dialogForm = ref();
const customInvalidEmbed = shallowRef<boolean>(false);

const linkMenuIndex = shallowRef<number>(0);
const linkMenu = computed<MenuItem[]>(() => [
  {
    label: 'URL',
  },
  {
    label: 'Embed',
  },
]);

const dialogHeader = computed(() => {
  switch (props.type) {
    case 'repositori':
      return 'Link Repositori';
    case 'microservices':
      return 'Link Micro Services';
    default:
      return 'Link Task';
  }
});

const initialValue = computed(() => ({
  url:
    props.initialValue?.linkType === 'url'
      ? props.initialValue.link
      : undefined,
  embedded:
    props.initialValue?.linkType === 'embedded'
      ? props.initialValue.link
      : undefined,
}));

const handleSubmit = async (payload: FormPayload): Promise<void> => {
  try {
    if (!taskId.value) return;

    const getLinkType = (): TaskLinkURLType => {
      if (props.type === 'link') {
        return linkMenuIndex.value === 0 ? 'url' : 'embedded';
      }

      return 'url';
    };

    const getLink = (): string => {
      if (getLinkType() === 'url') {
        return payload.formValues.url as unknown as string;
      }
      return payload.formValues.embed as unknown as string;
    };

    const dataDTO: EditTaskLinkDTO = {
      link: getLink(),
      linkType: getLinkType(),
      type: props.type === 'microservices' ? 'service' : 'task',
    };

    await TaskLinkServices.putTaskLink(taskId.value, dataDTO);

    refreshTaskHandler('update', taskId.value);

    visible.value = false;
  } catch (error) {
    toast.add({
      message: 'Link Task gagal disimpan.',
      error,
    });
  }
};

const handleClick = (): void => {
  dialogForm.value.form.submit();
};

const reset = (): void => {
  linkMenuIndex.value = 0;
};

const invalidEmbedMessage = computed(() =>
  customInvalidEmbed.value
    ? 'Code embeded tidak valid.'
    : { empty: 'Code embeded harus diisi.' },
);

const embedCodeValidation = (event: Event | string): void => {
  if (!(event as string).length) {
    customInvalidEmbed.value = false;
    return;
  }
  const isValid = whitelistIframeTag.test(event as string);
  customInvalidEmbed.value = !isValid;
};
</script>

<template>
  <DialogForm
    ref="dialogForm"
    v-model:visible="visible"
    :buttons-template="[]"
    :close-on-submit="false"
    :header="dialogHeader"
    @hide="reset"
    @submit="handleSubmit"
    closable
    data-wv-name="dialog-set-task-link"
  >
    <template #fields>
      <template v-if="props.type === 'link'">
        <TabMenu v-model:active-index="linkMenuIndex" :menu="linkMenu" />
        <div>
          <div v-if="linkMenuIndex === 0" data-wv-section="url-tab">
            <InputURL
              :validator-message="{
                empty: 'URL proses harus diisi.',
              }"
              :value="initialValue.url"
              field-name="url"
              label="URL"
              mandatory
              placeholder="Tulis URL"
              use-validator
            />
          </div>
          <div v-if="linkMenuIndex === 1" data-wv-section="code-embed-tab">
            <InputText
              :invalid="customInvalidEmbed"
              :validator-message="invalidEmbedMessage"
              :value="initialValue.embedded"
              @input="embedCodeValidation"
              field-name="embed"
              label="Code Embed"
              mandatory
              placeholder="Paste kode embed"
              use-validator
            />
          </div>
        </div>
      </template>
      <template v-else>
        <InputURL
          :validator-message="{
            empty: 'URL proses harus diisi.',
          }"
          :value="initialValue.url"
          field-name="link"
          label="URL"
          mandatory
          placeholder="Tulis URL"
          use-validator
        />
      </template>
      <div class="flex justify-end">
        <Button @click="handleClick" label="Simpan" severity="secondary" />
      </div>
    </template>
  </DialogForm>
</template>
