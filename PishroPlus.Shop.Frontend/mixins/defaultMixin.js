import { defaultStore } from "~/store/defaultStore";
import { mapState, mapActions } from "pinia";

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(defaultStore, {
      items: "items",
    }),
  },
  methods: {
    ...mapActions(defaultStore, {
      addItem: "addItem",
      removeItem: "removeItem",
      updateAmount: "updateAmount",
      clearCart: "addIteclearCartm",
      getTotalPrice: "getTotalPrice",
      getTotalItems: "getTotalItems",
    }),
  }
}
