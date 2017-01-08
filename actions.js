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


function calculateWeights() {
  for (let i = 0; i < 1600; i += 1) {
    for (let j = 0; j < 1600; j += 1) {
      let weight = 0
      if (i != j) {
        for (let n = 0; n < examples.length; n += 1) {
          weight += examples[n][i] * examples[n][j]
        }
      }
      weights[i][j] = weight
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


function nextIteration(i, image) {
  let sum = 0
  let changed = 0
  let out = null

  for (let j = 0; j < 1600; j += 1) {
    sum += weights[i][j] * image[j];
  }
  if (sum != 0) {
    if (sum < 0){
      out = -1;
    }
    if (sum > 0){
      out = 1;
    }
    console.log(sum)
    if (out != image[i]) {
      changed = 1;
      image[i] = out;
    }
  }
  return changed
}

function asynCor(img)
{
	let iteration = 0
	let iterationofLastChange = 0

	do {
		iteration += 1
		if (nextIteration(Math.floor(Math.random() * 1600), img))
			iterationofLastChange = iteration;
	} while (iteration - iterationofLastChange < 40 * 1600);
}


$('.js-learn-button').on('click', function() {
  calculateWeights()
  let currentImage = getCurrentImage()
  // console.log(currentImage.reduce(function(a, b) { return a + b; }, 0))
  asynCor(currentImage)
  // console.log(currentImage.reduce(function(a, b) { return a + b; }, 0))

  let _table = $('.js-outcome-table td')
  for (let tdIndx = 0; tdIndx < 1600; tdIndx += 1) {
    if (currentImage[tdIndx] == 1) {
      $(_table[tdIndx]).addClass('n-clicked').removeClass('n-clear-td')
    } else {
      $(_table[tdIndx]).removeClass('n-clicked').addClass('n-clear-td')
    }
  }

  // console.log(weights)
  // for (let exIndx = 0; exIndx < examples.length; exIndx += 1) {
  //   parsedExamples[exIndx] = []
  //   for (let x = 0; x < 40; x += 1) {
  //     parsedExamples[exIndx].push(examples[exIndx].slice(x * 40, x * 40 + 40))
  //   }
  // }
  // console.log(parsedExamples)
})
