const orderId = document.querySelector('#orderId')
const urlParam = new URLSearchParams(window.location.search)
const id = urlParam.get('id')

orderId.textContent = id