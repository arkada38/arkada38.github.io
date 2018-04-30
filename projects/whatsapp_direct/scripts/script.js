var app = new Vue({
  el: '#app',
  data: {
    tel: localStorage.getItem('tel') === null ? '' : localStorage.getItem('tel'),
    messages: localStorage.getItem('messages') === null ? ['Здравствуйте, ', 'Здравствуйте, ', 'Здравствуйте, ', 'Здравствуйте, ', 'Здравствуйте, '] :
      JSON.parse(localStorage.getItem('messages')),
    active_tab: localStorage.getItem('active_tab') === null ? '0' : localStorage.getItem('active_tab')
  },
  computed: {
    tel_numeric: function () {
      var numbers = this.tel.replace(/\D/g, '')

      if (numbers.charAt(0) == "0")
        numbers = numbers.replace("0", "66")

      if (numbers.charAt(0) == "8" && numbers.length === 11)
        numbers = numbers.replace("8", "7")

      return numbers
    },
    active_message: {
      get: function () {
        return this.messages[this.active_tab]
      },
      set: function (newValue) {
        Vue.set(this.messages, this.active_tab, newValue)
      }
    },
    message_encoded: function () {
      return encodeURI(this.messages[this.active_tab]).replace(/%5B/g, '[').replace(/%5D/g, ']')
    },
    whatsapp_link: function () {
      return 'https://api.whatsapp.com/send?phone=' + this.tel_numeric + '&text=' + this.message_encoded
    },
    country: function () {
      var data = new libphonenumber.parse('+' + this.tel_numeric)

      if (data.country == undefined)
        return ''

      return '<span class="badge badge-secondary">' + data.country + '</span> - <span class="badge badge-light">' + getCountryName(data.country) + '</span>'
    }
  },
  methods: {
    saveTel: function () {
      localStorage.setItem('tel', this.tel)
    },
    saveMessages: function () {
      localStorage.setItem('messages', JSON.stringify(this.messages))
    },
    clearTel: function () {
      this.tel = ''
      this.saveTel()
    },
    clearActiveMessage: function () {
      this.active_message = ''
      this.saveMessages()
    },
    setActiveTab: function (n) {
      this.active_tab = n
      localStorage.setItem('active_tab', n)
    }
  }
})
