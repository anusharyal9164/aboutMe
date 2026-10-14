// ---------- Country -> State dropdown ----------
const statesByCountry = {
  "United States": ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
  "Nepal": ["Koshi","Madhesh","Bagmati","Gandaki","Lumbini","Karnali","Sudurpashchim"],
  "India": ["Andhra Pradesh","Assam","Bihar","Delhi","Gujarat","Karnataka","Kerala","Maharashtra","Punjab","Rajasthan","Tamil Nadu","Uttar Pradesh","West Bengal"],
  "Canada": ["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Nova Scotia","Ontario","Prince Edward Island","Quebec","Saskatchewan"],
  "Other": ["Not listed"]
};

const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');

countrySelect.addEventListener('change', () => {
  const states = statesByCountry[countrySelect.value] || [];
  stateSelect.innerHTML = '<option value="" disabled selected>Select a state</option>' +
    states.map(s => `<option value="${s}">${s}</option>`).join('');
});

// ---------- Lab Problem 1: capture the submit button click, ----------
// ---------- build a customer object literal, store it, log it ----------
const customers = [];

const submitBtn = document.getElementById('submitBtn');
const appointmentForm = document.getElementById('appointmentForm');
const customerList = document.getElementById('customerList');
const formNote = document.getElementById('formNote');

submitBtn.addEventListener('click', (event) => {
  event.preventDefault(); // stop the form from actually submitting/reloading

  // 1) Create a customer object by way of a JS object literal
  const customer = {
    id: customers.length + 1,
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    country: document.getElementById('country').value,
    state: document.getElementById('state').value,
    regarding: document.getElementById('regarding').value
  };

  // 2) Store the object in the customers array
  customers.push(customer);

  // 3) Clear the console, and display the customer array
  console.clear();
  console.log(customers);

  // Change the structure of the DOM: add this customer to the visible list
  const li = document.createElement('li');
  li.textContent =
    `#${customer.id} - ${customer.name} (${customer.email}, ${customer.phone}) - ` +
    `${customer.state}, ${customer.country} - Regarding: ${customer.regarding}`;
  customerList.appendChild(li);

  formNote.hidden = false;
  appointmentForm.reset();
  stateSelect.innerHTML = '<option value="" disabled selected>Select a country first</option>';
});
