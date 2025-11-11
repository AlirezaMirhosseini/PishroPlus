<template>
  <v-card title="ماژول های ورودی">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <date-picker
            label="تاریخ بر اساس زبان انتخاب شده با placeholder"
            placeholder="--/--/--"
            :locale="$i18n.locale"
          />
        </v-col>
        <v-col cols="12" md="6"> <date-picker popover label="تاریخ بصورت popover" simple /></v-col>
        <v-col cols="12" md="6"> <date-picker label="تاریخ با اسپینر" simple /></v-col>
        <v-col cols="12" md="6"> <date-picker range label="انتخاب بازه تاریخ" /></v-col>
        <v-col cols="12" md="6"> <date-picker type="month" label="انتخاب ماه" /></v-col>
        <v-col cols="12" md="6"> <date-picker type="year-month" label="انتخاب ماه و سال" /></v-col>
        <v-col cols="12" md="6">
          <date-picker label="تاریخ با قابلیت سوییچ بین شمسی و میلادی" locale="fa,en"
        /></v-col>
        <v-col cols="12" md="6"> <date-time-picker label="تاریخ و زمان" :locale="$i18n.locale" /></v-col>
        <v-col cols="12" md="6">
          <date-time-picker :compactTime="true" label="تاریخ و زمان2" :locale="$i18n.locale"
        /></v-col>
        <v-col cols="12" md="6">
          <time-picker label="زمان" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      dateTimeModel: null
    }
  }
}
</script>

<style></style>
