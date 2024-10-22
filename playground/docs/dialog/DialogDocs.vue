<script setup lang="ts">
import { shallowRef } from 'vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';

const showDialog = shallowRef<boolean>(false);
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Dialog" /> </template>
    <template #content>
      <div class="flex gap-2">
        <Button
          @click="showDialog = true"
          icon="eye"
          label="Show Dialog"
          severity="secondary"
        />

        <Dialog
          v-model:visible="showDialog"
          class="w-[400px]"
          header="Dialog Header"
        >
          <span class="text-lg">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa quam
            quia? Dolor debitis reprehenderit aliquam fugit repellat unde,
            explicabo sint maiores eius, mollitia dolorum odio neque natus.
            Tenetur, id!
          </span>
          <span class="text-lg">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa quam
            quia? Dolor debitis reprehenderit aliquam fugit repellat unde,
            explicabo sint maiores eius, mollitia dolorum odio neque natus.
            Tenetur, id!
          </span>
          <span class="text-lg">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa quam
            quia? Dolor debitis reprehenderit aliquam fugit repellat unde,
            explicabo sint maiores eius, mollitia dolorum odio neque natus.
            Tenetur, id!
          </span>
          <span class="text-lg">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa quam
            quia? Dolor debitis reprehenderit aliquam fugit repellat unde,
            explicabo sint maiores eius, mollitia dolorum odio neque natus.
            Tenetur, id!
          </span>
          <span class="text-lg">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa quam
            quia? Dolor debitis reprehenderit aliquam fugit repellat unde,
            explicabo sint maiores eius, mollitia dolorum odio neque natus.
            Tenetur, id!
          </span>
          <template #footer>
            <Button label="Simpan" />
          </template>
        </Dialog>
      </div>
    </template>
  </Card>
</template>
