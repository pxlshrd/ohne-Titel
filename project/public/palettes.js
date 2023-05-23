function getPalettes(palettename) {
  palettename = $fx.getParam("palette")

  let palettes = [
    {
      'name': '1',
      'colors': ['#2C332F', '#4F5751', '#919C94', '#ACBFB7', '#425C36', '#8F9779', '#D1581F', '#C9BA77', '#CFC4A5', '#8A7A5E'],
      'back': ['#ACBFB7', '#D1581F', '#8A7A5E']
    },
    {
      'name': '2',
      'colors': ['#0D3437', '#295357', '#649B9C', '#ACC0B7', '#A39071', '#8CD19E', '#DE992A', '#649B9C', '#DEA345', '#295357'],
      'back': ['#ACC0B7', '#A39071', '#DEA345']
    },
    {
      'name': '3',
      'colors': ['#E9C955', '#539268', '#64A4C0', '#715347', '#C0ADC5', '#423A32', '#E76F51', '#A4C0BB', '#828892', '#E76F51'],
      'back': ['#C0ADC5', '#828892', '#539268']
    },
    {
      'name': '4',
      'colors': ['#29342F', '#827376', '#F2D49C', '#C7B198', '#A6BFB3', '#F5B7B1', '#88A096', '#EF8275', '#84758F', '#E8CCA0'],
      'back': ['#C7B198', '#A6BFB3', '#84758F']
    },
    {
      'name': '5',
      'colors': ['#8CD8A8', '#E7A3D8', '#A1A2E6', '#89DCE5', '#F5FF62', '#FFA07A', '#B0C4DE', '#959CA6', '#FFE985', '#9EF0CF'],
      'back': ['#959CA6', '#A1A2E6', '#F5FF62']
    },
    {
      'name': '6',
      'colors': ['#E66565', '#7F5991', '#A37868', '#827746', '#4C4C70', '#F2B552', '#D9AD9E', '#E0A6BA', '#ADABD4', '#626496'],
      'back': ['#D9AD9E', '#827746', '#4C4C70']
    },
    {
      'name': '7',
      'colors': ['#4B3663', '#7A5091', '#A66890', '#DE7E7E', '#C26A67', '#F2975A', '#D9AD9E', '#F2975A', '#D9B2C1', '#9C87B0'],
      'back': ['#D9AD9E', '#D9B2C1', '#4B3663']
    },
    {
      'name': '8',
      'colors': ['#CC8364', '#55727D', '#9199E6', '#E8B546', '#4F4F4F', '#CC5A43', '#7BB3B0', '#CC5A43', '#9C87B0', '#CCBFA7'],
      'back': ['#CCBFA7', '#9C87B0', '#4F4F4F']
    },
    {
      'name': '9',
      'colors': ['#A9C9B3', '#4D4B48', '#787571', '#B3AEA8', '#DED5CA', '#E8B546', '#CC5A43', '#E8B546', '#CC5A43', '#A9C9B3'],
      'back': ['#DED5CA', '#B3AEA8', '#A9C9B3']
    },
    {
      'name': '10',
      'colors': ['#E4D0AC', '#CEBC9F', '#1D3A32', '#CCB5EE', '#9EB0AF', '#242B2B', '#FF5907', '#C3FF0B', '#9EB0AF', '#CCB5EE'],
      'back': ['#E4D0AC', '#9EB0AF', '#FF5907']
    },
    {
      'name': '11',
      'colors': ['#FFE436', '#56A36A', '#E1E6C8', '#425E44', '#548046', '#4D9447', '#409099', '#5892AD', '#72AFB5', '#A8B9BD'],
      'back': ['#E1E6C8', '#A8B9BD', '#425E44']
    },  
    {
      'name': '12',
      'colors': ["#484B2F", "#999468", "#A6A676", "#D6CE93", "#EFEBCE", "#D8A48F", "#CA958C", "#BB8588", "#BDB88A", "#D6B09F"],
      'back': ['#EFEBCE', '#D6B09F', '#D6CE93']
    },
    {
      'name': '13',
      'colors': ["#403533", "#7D6465", "#75332B", "#66654D", "#999468", "#C9BCB1", "#BDA7A2", "#DECEBF", "#8FA09D", "#BCD6CE"],
      'back': ['#C9BCB1', '#8FA09D', '#7D6465']
    },

  ]

  let selectedPalette = palettes.find(palette => palette.name === palettename)
  return selectedPalette
}

function getColors() {
  colorpalette = getPalettes()

  if ($fx.getParam("background") == "light") {
    backCol = colorpalette.back[0]
  } else if ($fx.getParam("background") == "color 1") {
    backCol = colorpalette.back[1]
  } else if ($fx.getParam("background") == "color 2") {
    backCol = colorpalette.back[2]
  } else if ($fx.getParam("background") == "dark") {
    backCol = '#191818'
  } else if (dPressed == true) {
    backCol = '#191818'
  }
  colorzz = colorpalette.colors
  col3 = random(colorpalette.colors)
  col4 = random(colorpalette.colors)
  col5 = random(colorpalette.colors)
  shuffle(colorzz, true)

  if ($fx.getParam("colDist") == 'mono') {
    colorCount = 0
  } else if ($fx.getParam("colDist") == 'reduced 1') {
    colorCount = 45
  } else if ($fx.getParam("colDist") == 'reduced 2') {
    colorCount = 90
  } else if ($fx.getParam("colDist") == 'full palette') {
    colorCount = 180
  }
}