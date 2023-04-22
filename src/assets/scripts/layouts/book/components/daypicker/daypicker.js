import { Datepicker } from "vanillajs-datepicker";

const el = document.querySelector('input[name="days"]');
const datepicker = new Datepicker(el, {
  minDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  maxNumberOfDates: 3,
  title: "Select up to 3 days",
});
