'use strict'

let examples = []
let currentIndex = -1

$.ajax({
  url: 'http://localhost:3000/examples',
  dataType: 'json',
  success: function(data) {
    examples = data
    console.info(`Liczba przykładów ${examples.length}`)
  },
  error: function(data) {
    console.log(data)
  }
})

function showExample(indx) {
  let _table = $('.js-painter-table td')
  for (let tdIndx = 0; tdIndx < 1600; tdIndx += 1) {
    if (examples[indx][tdIndx] == 1) {
      $(_table[tdIndx]).addClass('n-clicked').removeClass('n-clear-td')
    } else {
      $(_table[tdIndx]).removeClass('n-clicked').addClass('n-clear-td')
    }
  }
}

$('.js-next-example').on('click', function() {
  if (currentIndex == examples.length - 1) {
    return
  }
  currentIndex += 1
  showExample(currentIndex)
})

$('.js-previous-example').on('click', function() {
  if (currentIndex == 0) {
    return
  }
  currentIndex -= 1
  showExample(currentIndex)
})

$('.js-save-example').on('click', function(){
  let jsonForSave = []
  let _table = $('.js-painter-table td')
  for (let tdIndx = 0; tdIndx < 1600; tdIndx += 1) {
    jsonForSave.push(
      $(_table[tdIndx]).hasClass('n-clicked') ? 1 : 0
    )
  }
  $.ajax({
    url: 'http://localhost:3000/addOrDelete',
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify({
      addOrDelete: 'addElem',
      jsonData: jsonForSave
    }),
    success: function(data) {
      window.location = window.location
    },
    error: function(data) {
      console.error('błąd')
    }
  })
})

$('.js-delete-example').on('click', function(){
    $.ajax({
    url: 'http://localhost:3000/addOrDelete',
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify({
      addOrDelete: 'deleteElem',
      jsonData: currentIndex
    }),
    success: function(data) {
      window.location = window.location
    },
    error: function(data) {
      console.error('błąd')
    }
  })
})
