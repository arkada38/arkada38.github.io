var app = new Vue({
  el: '#app',
  data: {
    tel: localStorage.getItem('tel') === null ? '' : localStorage.getItem('tel'),
    message: localStorage.getItem('message') === null ? 'Здравствуйте, ' : localStorage.getItem('message')
  },
  computed: {
    tel_numeric: function () {
      var numbers = this.tel.replace(/\D/g, '')

      if (numbers.charAt(0) == "0")
        numbers = numbers.replace("0", "66")

      return numbers
    },
    message_encoded: function () {
      return encodeURI(this.message).replace(/%5B/g, '[').replace(/%5D/g, ']')
    },
    whatsapp_link: function () {
      return 'https://api.whatsapp.com/send?phone=' + this.tel_numeric + '&text=' + this.message_encoded
    }
  },
  methods: {
    saveTel: function () {
      localStorage.setItem('tel', this.tel)
    },
    saveMessage: function () {
      localStorage.setItem('message', this.message)
    },
    clearTel: function () {
      this.tel = ''
      this.saveTel()
    },
    clearMessage: function () {
      this.message = ''
      this.saveMessage()
    }
  }
})