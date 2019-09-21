<template>
  <p>{{ $t("close") }}</p>
</template>

<script>
import { i18n } from "@/libs/i18n";

export default {
  name: "TestI18n",
  i18n: i18n,
  created() {
    this.$i18n.locale = "fr";
  }
};
</script>
