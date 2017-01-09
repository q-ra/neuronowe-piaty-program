'use strict'

let examples = []
let currentIndex = -1
let parsedExamples = []

let weights = []

for (let x = 0; x < 1600; x += 1) {
  weights.push(new Array(1600).fill(0))
}


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

$('.js-save-example').on('click', function() {
  let jsonForSave = []
  let _table = $('.js-painter-table td')
  for (let tdIndx = 0; tdIndx < 1600; tdIndx += 1) {
    jsonForSave.push(
      $(_table[tdIndx]).hasClass('n-clicked') ? 1 : -1
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

$('.js-delete-example').on('click', function() {
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

$('.js-clear-button').on('click', function(){
  window.location = window.location
})


function calculateWeights() {
  for (let x = 0; x < 1600; x += 1) {
    for (let y = 0; y < 1600; y += 1) {
      let weight = 0
      if (x != y) {
        for (let n = 0; n < examples.length; n += 1) {
          weight += examples[n][x] * examples[n][y]
        }
      }
      weights[x][y] = weight
    }
  }
}

function getCurrentImage(){
  let currentImage = []
  let _table = $('.js-painter-table td')
  for (let tdIndx = 0; tdIndx < 1600; tdIndx += 1) {
    currentImage.push(
      $(_table[tdIndx]).hasClass('n-clicked') ? 1 : -1
    )
  }
  return currentImage
}

function paintExample(img){
  let _table = $('.js-outcome-table td')
  for (let tdIndx = 0; tdIndx < 1600; tdIndx += 1) {
    if (img[tdIndx] == 1) {
      $(_table[tdIndx]).addClass('n-clicked').removeClass('n-clear-td')
    } else {
      $(_table[tdIndx]).removeClass('n-clicked').addClass('n-clear-td')
    }
  }
}


function hasChanged(x, image) {
  let sum = 0
  let fals = 0
  let out = null
  let changed = false

  for (let y = 0; y < 1600; y += 1) {
    sum += weights[x][y] * image[y];
  }

  if (sum != 0) {

    out = sum < 0 ? -1 : 1

    if (out != image[x]) {
      changed = true
      image[x] = out
    }
  }
  return changed
}

function glauber(img){
	let iteration = 0
	let lastChange = 0
	do {
		iteration += 1
		if (hasChanged(Math.floor(Math.random() * 1600), img))
			lastChange = iteration
	} while (iteration - lastChange < 40 * 1600) // czekanie aż się ustabilizuje
}


$('.js-learn-button').on('click', function() {
  let currentImage = getCurrentImage()
  calculateWeights()
  glauber(currentImage)
  paintExample(currentImage)
})
