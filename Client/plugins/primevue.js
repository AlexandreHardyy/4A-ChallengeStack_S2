import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch';
import Toast from 'primevue/toast'
import Password from "primevue/password";
import ToastService from 'primevue/toastservice'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Card from 'primevue/card';
import Calendar from 'primevue/calendar';
import Chart from 'primevue/chart';
import DialogService from "primevue/dialogservice";
import DynamicDialog from "primevue/dynamicdialog";
import Tooltip from "primevue/tooltip";
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmPopup from 'primevue/confirmpopup';
import InputMask from 'primevue/inputmask';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(PrimeVue, {ripple: true})
    nuxtApp.vueApp.use(ToastService)
    nuxtApp.vueApp.use(DialogService)
    nuxtApp.vueApp.use(ConfirmationService)
    nuxtApp.vueApp.directive('tooltip', Tooltip);
    nuxtApp.vueApp.component('Button', Button)
    nuxtApp.vueApp.component('InputText', InputText)
    nuxtApp.vueApp.component('InputSwitch', InputSwitch)
    nuxtApp.vueApp.component('Toast', Toast)
    nuxtApp.vueApp.component('Password', Password)
    nuxtApp.vueApp.component('DataTable', DataTable)
    nuxtApp.vueApp.component('Column', Column)
    nuxtApp.vueApp.component('Tag', Tag)
    nuxtApp.vueApp.component('Card', Card)
    nuxtApp.vueApp.component('Calendar', Calendar)
    nuxtApp.vueApp.component('Chart', Chart)
    nuxtApp.vueApp.component('DynamicDialog', DynamicDialog)
    nuxtApp.vueApp.component('ConfirmPopup', ConfirmPopup)
    nuxtApp.vueApp.component('InputMask', InputMask)
    nuxtApp.vueApp.component('TabView', TabView)
    nuxtApp.vueApp.component('TabPanel', TabPanel)
    //other components that you need
})