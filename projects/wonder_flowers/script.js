Vue.component('calc-item', {
  props: ['index'],
  template: '<div><br>\
<div class="card">\
  <div class="card-header">Дополнительная доставка</div>\
  <div class="card-body">\
      <div class="row">\
          <div class="col">\
              <div class="form-group">\
                  <label>Время в пути:</label>\
                  <input type="number" class="form-control" v-model.number="duration" min=0 v-on:input="update">\
              </div>\
              <button type="button" class="btn btn-outline-primary btn-block" v-on:click="add">Добавить</button>\
          </div>\
          <div class="col">\
              <div class="form-group">\
                  <label>Стоимость:</label>\
                  <input type="number" class="form-control" v-model.number="cost" disabled>\
              </div>\
              <button type="button" class="btn btn-outline-primary btn-block" v-on:click="remove">Удалить</button>\
          </div>\
      </div>\
  </div>\
</div></div>',
  data: function () {
    return {
      duration: 0
    }
  },
  computed: {
    cost: function () {
      return this.duration * 5
    }
  },
  methods: {
    add: function () {
      this.$emit('add', this.index)
    },
    remove: function () {
      this.$emit('remove', this.index)
    },
    update: function () {
      this.$emit('update', {
        duration: this.duration, cost: this.cost, index: this.index
      })
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    duration: 0,
    additional: [],
    newId: 0,
    additionalDuration: 0,
    additionalCost: 0
  },
  computed: {
    cost: function () {
      return Math.round(450 + Math.atan((this.duration - 30) / 20) * 230)
    },
    totalDuration: function () {
      return this.duration + this.additionalDuration
    },
    totalCost: function () {
      return this.cost + this.additionalCost
    }
  },
  methods: {
    add: function () {
      this.additional.splice(0, 0, {
        id: this.newId++,
        duration: 0,
        cost: 0
      })
    },
    addAfterItem: function (index) {
      if (this.additional.length <= index + 1)
        this.additional.push({
          id: this.newId++,
          duration: 0,
          cost: 0
        })
      else
        this.additional.splice(index + 1, 0, {
          id: this.newId++,
          duration: 0,
          cost: 0
        })
    },
    updateItem: function (val) {
      var item = this.additional[val.index]

      this.additionalDuration -= item.duration
      this.additionalCost -= item.cost

      item.duration = val.duration
      item.cost = val.cost

      this.additionalDuration += item.duration
      this.additionalCost += item.cost
    },
    removeItem: function (index) {
      var item = this.additional[index]

      this.additionalDuration -= item.duration
      this.additionalCost -= item.cost

      this.additional.splice(index, 1)
    }
  }
})