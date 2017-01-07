'use strict'

//NOTE generowanie tabelek
$(document).ready(function() {
  function createTable(tableClass) {
    var _table = $(tableClass)
    for (let _trIt of Array(40)) {
      var _tr = $('<tr />').appendTo(_table)
      for (let _tdIt of Array(40)) {
        $('<td />').appendTo(_tr).addClass('n-clear-td')
      }
    }
  }

  createTable('.js-painter-table')
  createTable('.js-outcome-table')
})

//NOTE rysowanie po lewej tabelce
$(document).ready(function() {
  var mouseWasClicked = false

  $('.js-painter-table').mousedown(function() {
    mouseWasClicked = true
  }).mouseup(function() {
    mouseWasClicked = false
  })


  $('.js-painter-table td').on('click', function(e) {
    $(this).addClass('n-clicked')
  }).mouseover(function() {
    if (mouseWasClicked)
      this.click()
  })
})
