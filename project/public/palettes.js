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
      'colors': ['#8CD8A8', '#E7A3D8', '#A1A2E6', '#89DCE5', '#F5FF62', '#FFA07A', '#B0C4DE', '#959CA6', '#383B40', '#9EF0CF'],
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
      'colors': ['#A9C9B3', '#4D4B48', '#787571', '#403E3C', '#DED5CA', '#E8B546', '#CC5A43', '#E8B546', '#CC5A43', '#A9C9B3'],
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
    {
      'name': '14',
      'colors': ["#FF6370", "#FF7592", "#FF88B5", "#383B40", "#FFB2FF", "#D2ABFF", "#A8A0FF", "#8481FF", "#5E63FF", "#3B4EFF"],
      'back': ['#C9BCB1', '#8FA09D', "#D2ABFF"]
    },
    {
      'name': '15',
      'colors': ['#D68B71', '#A65B4A', '#E8CBAE', '#BD8D6C', '#8C634B', '#5F4834', '#A9B9AE', '#73857D', '#516361', '#343F4D'],
      'back': ['#C9BCB1', '#8FA09D', '#E4D0AC']
    },
    {
      'name': '16',
      'colors': ['#242B29', '#6F705F', '#668749', '#86AB5E', '#EDDB68', '#F57842', '#68A6A1', '#B8D8E6', '#B19AE3', '#FFD7D1'],
      'back': ['#E4D0AC', '#FFD7D1', '#B8D8E6']
    },
    {
      'name': '17',
      'colors': ['#2B2B26', '#494A3F', '#6F705F', '#8D8C7C', '#ABA798', '#BFBDAC', '#D6D5BF', '#E3E3CA', '#D5DE28', '#7A68BD'],
      'back': ['#D6D5BF', '#ABA798', '#494A3F']
    },
    {
      'name': '18',
      'colors': ['#2B2B26', '#494A3F', '#6F705F', '#8D8C7C', '#ABA798', '#BFBDAC', '#D6D051', '#E3E3CA', '#7CCFBD', '#2B83D6'],
      'back': ['#D6D5BF', '#ABA798', '#494A3F']
    },
    {
      'name': '19',
      'colors': ['#02161C', '#152F30', '#767A4E', '#537341', '#C2402D', '#D6BA3E', '#DE905F', '#E3E3CA', '#E6DA9E', '#2B4F48'],
      'back': ['#D6BA3E', '#E6DA9E', '#767A4E']
    },
    {
      'name': '20',
      'colors': ['#323028', '#635B49', '#59705A', '#849E77', '#C26C37', '#F98C59', '#C4964E', '#CDB372', '#D6B98B', '#E4D0AC'],
      'back': ['#E4D0AC', '#CDB372', '#59705A']
    },
    {
      'name': '21',
      'colors': ['#585835', '#8C8B43', '#464D5A', '#536D8B', '#83A8A9', '#D16F45', '#E0896C', '#CFA984', '#D2C0AB', '#FAE5C8'],
      'back': ['#FAE5C8', '#D2C0AB', '#CFA984']
    },
    {
      'name': '22',
      'colors': ['#3C4037', '#35544C', '#506B5A', '#6F8C64', '#8BA775', '#9C9063', '#C3BA89', '#F3BE4C', '#FACC82', '#FCE0B0'],
      'back': ['#FCE0B0', '#C3BA89', '#F3BE4C']
    },
    {
      'name': '23',
      'colors': ['#37342A', '#637053', '#8D9A84', '#8C854F', '#A9AF41', '#D6A949', '#D88248', '#E39D94', '#9C7280', '#EBD6A7'],
      'back': ['#EBD6A7', '#C3BA89', '#D6A949']
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

  
  colorzz = colorpalette.colors.filter(color => color !== backCol)
  col3 = random(colorpalette.colors.filter(color => color !== backCol))
  col4 = random(colorpalette.colors.filter(color => color !== backCol))
  col5 = random(colorpalette.colors.filter(color => color !== backCol))
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