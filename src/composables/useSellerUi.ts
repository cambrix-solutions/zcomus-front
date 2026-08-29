import { computed, ref } from 'vue';

export type SellerPanelId =
  | 'dashboard'
  | 'listings'
  | 'orders'
  | 'analytics'
  | 'payouts'
  | 'storefront'
  | 'settings';

const panel = ref<SellerPanelId>('dashboard');
const showListingForm = ref(false);
const editingListingId = ref<string | null>(null);
const mobileNavOpen = ref(false);

export function useSellerUi() {
  const isComposingListing = computed(() => showListingForm.value);
  const isEditingListing = computed(() => !!editingListingId.value);

  function openPanel(id: SellerPanelId) {
    panel.value = id;
    showListingForm.value = false;
    editingListingId.value = null;
    mobileNavOpen.value = false;
  }

  function openAddListing() {
    editingListingId.value = null;
    showListingForm.value = true;
    mobileNavOpen.value = false;
  }

  function openEditListing(id: string) {
    editingListingId.value = id;
    showListingForm.value = true;
    mobileNavOpen.value = false;
  }

  function closeListingForm() {
    showListingForm.value = false;
    editingListingId.value = null;
  }

  return {
    panel,
    showListingForm,
    editingListingId,
    isComposingListing,
    isEditingListing,
    mobileNavOpen,
    openPanel,
    openAddListing,
    openEditListing,
    closeListingForm,
  };
}
