
const concepts = {
  'object': ['Object', 'Thing', 'Package'],
  'person': ['Person', 'Family', 'Group'],
  'female': ['Female/Woman', 'Wife', 'Feminine'],
  'male': ['Male/Man', 'Husband', 'Masculine'],
  'work': ['Work', 'Profession', 'Craft'],
  'recreation': ['Recreation', 'Sport', 'Activity'],
  'wildlife': ['Wildlife', 'Animal'],
  'flora': ['Flora', 'Nature', 'Plant'],
  'literature': ['Literature', 'Writing', 'Book'],
  'music': ['Music', 'Song', 'Note'],
  'theatre': ['Theatre', 'Film', 'Camera'],
  'arts': ['Arts', 'Sculpture/Painting', 'Drawing/Comics'],
  'television': ['Television', 'Broadcast', 'Series'],
  'title': ['Title', 'Brand', 'Name'],
  'idea': ['Idea', 'Thought', 'Concept'],
  'expression': ['Expression/Quote', 'Speak', 'Word'],
  'location': ['Location', 'Country', 'Flag'],
  'building': ['Building', 'Construction', 'City'],
  'date': ['Date', 'Event', 'Daytime'],
  'holidays': ['Holidays', 'Birthday', 'Celebration'],
  'watercraft': ['Watercraft', 'Maritime', 'Swim'],
  'airborne': ['Airborne vehicle', 'Airline', 'Fly'],
  'vehicle': ['Land vehicle', 'Car', 'Ride'],
  'tools': ['Tools', 'Construction'],
  'games': ['Games', 'Toys', 'Youth'],
  'clothing': ['Clothing', 'Accessories', 'Costume'],
  'food': ['Food', 'Nutrition', 'Edible'],
  'home': ['Home', 'Interior', 'Domestic'],
  'reality': ['Reality', 'History'],
  'fictional': ['Fictional', 'Imaginary', 'Wish'],
  'baby': ['Baby/Child', 'Young', 'New'],
  'adult': ['Adult/Old', 'Ancient', 'Past'],
  'slow': ['Slow', 'Lengthy', 'Turtle'],
  'fast': ['Fast', 'Lively', 'Hare'],
  'defence': ['Defence', 'Protection', 'Wall'],
  'conflict': ['Conflict', 'Weapon', 'Fight'],
  'life': ['Life', 'Heart', 'Love'],
  'death': ['Death', 'Evil', 'Disease'],
  'joyous': ['Joyous', 'Positive'],
  'sad': ['Sad', 'Negative'],
  'electronics': ['Electronics', 'Computer'],
  'mechanical': ['Mechanical', 'Industrial'],
  'money': ['Money', 'Rich', 'Expensive'],
  'time': ['Time', 'Duration'],
  'religion': ['Religion', 'Myth', 'Belief'],
  'power': ['Power', 'Politics'],
  'science': ['Science', 'Mathematics', 'Chemistry'],
  'medical': ['Medical', 'Drug', 'Cure'],
  'head': ['Head', 'Face'],
  'arm': ['Arm', 'Hand'],
  'torso': ['Torso', 'Stomach'],
  'leg': ['Leg', 'Foot'],
  'ear': ['Ear', 'Sound', 'Hear'],
  'nose': ['Nose', 'Odor', 'Smell'],
  'eye': ['Eye', 'View', 'Watch'],
  'mouth': ['Mouth', 'Flavor', 'Eat'],
  'cloud': ['Cloud', 'Rain', 'Snow/Cold'],
  'lightning': ['Lightning/Electricity', 'Storm', 'Anger'],
  'night': ['Night', 'Evening', 'Moon'],
  'sun': ['Sun/Heat', 'Light', 'Daytime'],
  'fire': ['Fire', 'Burn', 'Heat'],
  'water': ['Water', 'Liquid', 'Aquatic'],
  'air': ['Air', 'Wind', 'Blow'],
  'earth': ['Earth', 'Dirt', 'Grow'],
  'rock': ['Rock', 'Mineral', 'Hard'],
  'wood': ['Wood'],
  'metal': ['Metal'],
  'fabric': ['Fabric'],
  'plastic': ['Plastic', 'Rubber'],
  'paper': ['Paper', 'Sheet'],
  'opposed': ['Opposed', 'Contrary', 'Inverse'],
  'break': ['Break', 'Separate', 'Half'],
  'fragment': ['Fragment', 'Multitude', 'Powder'],
  'part': ['Part', 'Bit', 'Piece'],
  'inside': ['Inside', 'Internal'],
  'grid': ['Grid', 'Network', 'Prison'],
  'zero': ['Zero', 'Nothing', 'Null'],
  'unity': ['Unity', 'One'],
  'straight': ['Straight line', 'Smooth', 'Rise'],
  'curve': ['Curve', 'Arc', 'Rounded'],
  'cross': ['Cross', 'Intersection', 'Addition'],
  'broken': ['Broken line', 'Sharp', 'Uneven'],
  'spiral': ['Spiral', 'Intoxication/Madness', 'Coil'],
  'sinusoidal': ['Sinusoidal', 'Ripple', 'Hair'],
  'ring': ['Ring', 'Cycle'],
  'circle': ['Circle', 'Button'],
  'triangle': ['Triangle'],
  'star': ['Star'],
  'rectangle': ['Rectangle', 'Square'],
  'flat': ['Flat'],
  'cube': ['Cube', 'Brick'],
  'sphere': ['Sphere'],
  'pyramid': ['Pyramid'],
  'cylinder': ['Cylinder'],
  'cone': ['Cone'],
  'hollow': ['Hollow', 'Hole', 'Pierced'],
  'tall': ['Tall', 'Greater', 'High'],
  'small': ['Small', 'Lower', 'Below'],
  'huge': ['Huge', 'Wider', 'Longer'],
  'skinny': ['Skinny', 'Closer', 'Brief'],
  'top': ['Top', 'Up', 'Mount'],
  'low': ['Low', 'Down', 'Under'],
  'left': ['Left', 'First', 'Before'],
  'right': ['Right', 'End', 'After'],
  'turn': ['Turn', 'Surround', 'Cycle'],
  'use': ['Use/Activate', 'Verb'],
  'red': ['Red'],
  'orange': ['Orange'],
  'yellow': ['Yellow'],
  'green': ['Green'],
  'blue': ['Blue'],
  'purple': ['Purple'],
  'pink': ['Pink'],
  'brown': ['Brown'],
  'black': ['Black'],
  'gray': ['Gray'],
  'white': ['White'],
  'clear': ['Clear', 'Invisible']
}

export default concepts

export const colours = {
  'red': 'red',
  'orange': 'orange',
  'yellow': 'yellow',
  'green': 'green',
  'blue': 'blue',
  'purple': 'purple',
  'pink': 'pink',
  'brown': 'brown',
  'black': 'black',
  'gray': 'gray',
  'white': 'white',
}

export const filters = [
  {
    'name': 'All',
    'keys': Object.keys(concepts)
  },
  {
    'name': 'Body',
    'keys': ['head', 'arm', 'torso', 'leg', 'ear', 'nose', 'eye', 'mouth']
  },
  {
    'name': 'Elements',
    'keys': ['cloud', 'lightning', 'night', 'sun', 'fire', 'water', 'air', 'earth', 'rock', 'wood', 'metal', 'fabric', 'plastic', 'paper']
  },
  {
    'name': 'Shapes',
    'keys': ['straight', 'curve', 'cross', 'broken', 'spiral', 'sinusoidal', 'ring', 'circle', 'triangle', 'star', 'rectangle', 'flat', 'cube', 'sphere', 'pyramid', 'cylinder', 'cone', 'hollow']
  },
  {
    'name': 'Colours',
    'keys': ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'black', 'gray', 'white', 'clear']
  }
]
