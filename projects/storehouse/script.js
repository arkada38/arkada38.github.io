Vue.component('store-item', {
  props: ['groupIndex', 'index', 'name', 'price', 'quantity', 'mode'],
  template: '\
  <div class="card mb-3">\
    <div class="card-body">\
      <h4 class="card-title">{{ name }}</h4>\
      <p class="card-text"><span class="badge badge-danger">x{{ quantity }}</span> by <span class="badge badge-warning">{{ price }}</span></p>\
      <a href="#" v-if="mode === \'storehouse\'" class="card-link" data-toggle="modal" data-target="#numericModal" v-on:click="decrease()">Decrease</a>\
      <a href="#" v-if="mode === \'storehouse\'" class="card-link" data-toggle="modal" data-target="#numericModal" v-on:click="increase()">Increase</a>\
      <a href="#" v-if="mode === \'storehouse\'" class="card-link" data-toggle="modal" data-target="#itemModal" v-on:click="change()">Change</a>\
      <a href="#" v-if="mode === \'storehouse\'" class="card-link" data-toggle="modal" data-target="#yesNoModal" v-on:click="remove()">Delete</a>\
      <div class="row" v-if="mode === \'store\'">\
        <div class="col-3"><button type="button" class="btn btn-outline-primary btn-block" v-on:click="decreaseHolder()">-</button></div>\
        <div class="col-6"><input type="number" class="form-control" v-model="holderProp" min=0 :max=quantity></div>\
        <div class="col-3"><button type="button" class="btn btn-outline-primary btn-block" v-on:click="increaseHolder()">+</button></div>\
      </div>\
    </div>\
  </div>',
  data: function () {
    return {
      holder: 0
    }
  },
  computed: {
    totalCost: function () {
      return this.price * this.quantity
    },
    holderProp: {
      get: function () {
        return this.holder
      },
      set: function (newValue) {
        this.holder = Math.max(0, Math.min(newValue, this.quantity))
        this.$emit('product-changed')
      }
    }
  },
  methods: {
    increase: function () {
      this.$emit('increase', this.index)
    },
    decrease: function () {
      this.$emit('decrease', this.index)
    },
    change: function () {
      this.$emit('change', this.index)
    },
    remove: function () {
      this.$emit('remove', this.index)
    },

    increaseHolder: function () {
      if (this.holderProp < this.quantity)
        this.holderProp++
    },
    decreaseHolder: function () {
      if (this.holderProp > 0)
        this.holderProp--
    },

    createProduct: function (setHolderToZero = true) {
      var res = {
        name: this.name,
        price: this.price,
        quantity: this.holder,
        groupIndex: this.groupIndex,
        index: this.index
      }

      if (setHolderToZero)
        this.holder = 0

      return res
    }
  }
})

Vue.component('store-group', {
  props: ['index', 'name', 'color', 'items', 'mode'],
  template: '\
  <div class="card mb-3 bg-light">\
    <div class="card-header">\
        <b>{{ name }}</b>\
        <button v-if="mode === \'storehouse\'" type="button" class="btn btn-primary float-right ml-1 btn-sm" data-toggle="modal" data-target="#yesNoModal" v-on:click="removeGroup()">\
          <i class="fas fa-trash-alt"></i>\
        </button>\
        <button v-if="mode === \'storehouse\'" type="button" class="btn btn-primary float-right ml-1 btn-sm" data-toggle="modal" data-target="#itemModal" v-on:click="addItem()">\
          <i class="fas fa-plus"></i>\
        </button>\
    </div>\
    <div class="card-body">\
      <store-item v-for="(item, i) in items"\
        :key="item.id"\
        :groupIndex="index"\
        :index="i"\
        :name="item.name"\
        :price="item.price"\
        :quantity="item.quantity"\
        :mode="mode"\
        v-on:remove="removeItem"\
        v-on:increase="increaseItem"\
        v-on:decrease="decreaseItem"\
        v-on:change="changeItem"\
        v-on:product-changed="productChanged"></store-item>\
      <button v-if="mode === \'storehouse\'" type="button" class="btn btn-primary" data-toggle="modal" data-target="#itemModal" v-on:click="addItem()">Add new item</button>\
    </div>\
  </div>',
  data: function () {
    return {}
  },
  computed: {
    quantity: function () {
      return this.items.length
    },
    totalCost: function () {
      var res = 0

      for (var i = 0; i < this.quantity; i++)
        res += this.items[i].price * this.items[i].quantity

      return res
    }
  },
  methods: {
    addItem: function () {
      this.$emit('add-item', this.index)
    },
    removeItem: function (itemIndex) {
      this.$emit('remove-item', this.index, itemIndex)
    },
    removeGroup: function () {
      this.$emit('remove-group', this.index)
    },
    increaseItem: function (itemIndex) {
      this.$emit('increase-item', this.index, itemIndex)
    },
    decreaseItem: function (itemIndex) {
      this.$emit('decrease-item', this.index, itemIndex)
    },
    changeItem: function (itemIndex) {
      this.$emit('change-item', this.index, itemIndex)
    },

    productChanged: function () {
      this.$emit('product-changed')
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    storehouseName: 'WonderFlowers',
    mode: 'storehouse',
    groups: [
      {
        name: 'Roses',
        color: 'pink',
        items: [
          {
            name: 'Roses RED',
            price: 50,
            quantity: 50
          },
          {
            name: 'Roses WHITE',
            price: 60,
            quantity: 30
          },
          {
            name: 'Roses PINK / VIOLETE',
            price: 70,
            quantity: 50
          },
          {
            name: 'Eustoma MIX',
            price: 90,
            quantity: 70
          },
          {
            name: 'Limonium pink',
            price: 55,
            quantity: 10
          },
          {
            name: 'Million Stars Pink',
            price: 100,
            quantity: 10
          },
          {
            name: 'Gypsy',
            price: 100,
            quantity: 8
          },
          {
            name: 'Statice',
            price: 40,
            quantity: 20
          },
          {
            name: 'Mstthiola',
            price: 45,
            quantity: 20
          }
        ]
      },
      {
        name: 'Holland',
        color: 'green',
        items: [
          {
            name: 'Protea Pin',
            price: 500,
            quantity: 3
          },
          {
            name: 'Lilac',
            price: 360,
            quantity: 5
          }
        ]
      },
      {
        name: 'Greens',
        color: 'green',
        items: [
          {
            name: 'Eucaliptus 1 branch',
            price: 170,
            quantity: 4
          },
          {
            name: 'Eucaliptus small branch',
            price: 50,
            quantity: 10
          },
          {
            name: 'Dusty Miller',
            price: 50,
            quantity: 10
          }
        ]
      }
    ],
    logs: [],
    newGroupName: '',
    newItemModal: {
      title: '',
      actionName: '',
      name: '',
      price: 0,
      quantity: 0,
      groupIndex: 0,
      onSuccess: function () { }
    },
    yesNoModal: {
      title: '',
      message: '',
      onSuccess: function () { }
    },
    numericModal: {
      title: '',
      fieldName: '',
      value: 0,
      onSuccess: function () { }
    },
    productModal: {
      title: '',
      actionName: '',
      items: [],
      itemsCost: 0,
      creationalCost: 0,
      deliveryCost: 0,
      additionalCost: 0,
      comment: '',
      onSuccess: function () { }
    }
  },
  computed: {
    cost: function () {
      return 0
    },
    productTotalCost: function () {
      return this.productModal.itemsCost +
        parseFloat(this.productModal.creationalCost) +
        parseFloat(this.productModal.deliveryCost) +
        parseFloat(this.productModal.additionalCost)
    }
  },
  methods: {
    getDate: function (date) {
      return moment.parseZone(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    addNewGroup: function () {
      this.groups.push({ name: this.newGroupName, items: [] })

      this.logs.unshift({
        title: 'Added new group',
        message: 'Added new group with ' + this.newGroupName + ' name',
        date: new Date().getTime()
      })

      this.newGroupName = ''
    },
    removeGroup: function (groupIndex) {
      this.yesNoModal.title = 'Warning!'
      var groupName = this.groups[groupIndex].name
      this.yesNoModal.message = 'Do you want to remove the ' + groupName + ' group?'

      var groups = this.groups
      var logs = this.logs
      this.yesNoModal.onSuccess = function () {
        groups.splice(groupIndex, 1)

        logs.unshift({
          title: 'Removed group',
          message: 'Removed group with ' + groupName + ' name',
          date: new Date().getTime()
        })
      }
    },

    removeItem: function (groupIndex, itemIndex) {
      this.yesNoModal.title = 'Warning!'
      var itemName = this.groups[groupIndex].items[itemIndex].name
      this.yesNoModal.message = 'Do you want to remove the ' + itemName + ' item?'

      var groups = this.groups
      var logs = this.logs
      this.yesNoModal.onSuccess = function () {
        groups[groupIndex].items.splice(itemIndex, 1)

        logs.unshift({
          title: 'Removed item',
          message: 'Removed item with ' + itemName + ' name',
          date: new Date().getTime()
        })
      }
    },
    addNewItem: function (groupIndex) {
      var item = this.newItemModal
      item.title = 'Adding new item'
      item.actionName = 'Add'
      item.groupIndex = groupIndex

      var groups = this.groups
      var logs = this.logs

      item.onSuccess = function () {
        groups[item.groupIndex].items.push({ name: item.name, price: item.price, quantity: item.quantity })

        logs.unshift({
          title: 'Added item',
          message: 'Added item with ' + item.name + ' name (price: ' + item.price + ', quantity: ' + item.quantity + ')',
          date: new Date().getTime(),
          data: {
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }
        })
      }
    },
    increaseItem: function (groupIndex, itemIndex) {
      this.numericModal.title = 'Increasing'
      var item = this.groups[groupIndex].items[itemIndex]
      this.numericModal.fieldName = 'How many items of ' + item.name + ' do you want to add?'

      var groups = this.groups
      var logs = this.logs
      var numericModal = this.numericModal

      this.numericModal.onSuccess = function () {
        item.quantity += parseInt(numericModal.value)

        logs.unshift({
          title: 'Increased item',
          message: 'Increased item with ' + item.name + ' name on ' + numericModal.value + ' pc(s)',
          date: new Date().getTime()
        })

        numericModal.value = 0
      }
    },
    decreaseItem: function (groupIndex, itemIndex) {
      this.numericModal.title = 'Decreasing'
      var item = this.groups[groupIndex].items[itemIndex]
      this.numericModal.fieldName = 'How many items of ' + item.name + ' do you want to remove?'

      var groups = this.groups
      var logs = this.logs
      var numericModal = this.numericModal

      this.numericModal.onSuccess = function () {
        groups[groupIndex].items[itemIndex].quantity -= parseInt(numericModal.value)

        logs.unshift({
          title: 'Decreased item',
          message: 'Decreased item with ' + item.name + ' name on ' + numericModal.value + ' pc(s)',
          date: new Date().getTime()
        })

        numericModal.value = 0
      }
    },
    changeItem: function (groupIndex, itemIndex) {
      var oldItem = this.groups[groupIndex].items[itemIndex]
      var item = this.newItemModal
      item.title = 'Changing item'
      item.actionName = 'Change'

      item.name = oldItem.name
      item.price = oldItem.price
      item.quantity = oldItem.quantity

      item.onSuccess = function () {
        oldItem.name = item.name
        oldItem.price = item.price
        oldItem.quantity = item.quantity
      }
    },

    createProduct: function () {
      this.productModal.title = 'Do you want to create the product?'
      this.productModal.actionName = 'Create'

      this.productModal.itemsCost = 0
      this.productModal.creationalCost = 0
      this.productModal.deliveryCost = 0
      this.productModal.additionalCost = 0
      this.productModal.comment = ''

      this.productModal.items.forEach(item => {
        this.productModal.itemsCost += item.price * item.quantity
      })

      var product = this.productModal
      var logs = this.logs

      this.productModal.onSuccess = function () {
        console.log(product)
        var totalCost = parseFloat(product.itemsCost) +
          parseFloat(product.creationalCost) +
          parseFloat(product.deliveryCost) +
          parseFloat(product.additionalCost)

        logs.unshift({
          title: 'Created new product',
          message: 'Created new product with ' + totalCost + ' total cost',
          date: new Date().getTime()
        })

        product.items.forEach(item => {
          app.groups[item.groupIndex].items[item.index].quantity -= item.quantity
        })
      }
    },
    productChanged: function () {
      this.productModal.items = []

      this.$children.forEach(group => {
        group.$children.forEach(item => {
          var productItem = item.createProduct(false)

          if (productItem.quantity > 0) {
            this.productModal.items.push(productItem)
          }
        })
      })
    }
  }
})