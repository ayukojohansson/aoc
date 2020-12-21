import re
from collections import deque, defaultdict
from itertools import combinations, product

file = open("input.txt", "r")
lines = file.read()
file.close()

def main2(rawInput):
	pixDict = defaultdict(list)
	tileDict = defaultdict(list)
	for chunk in rawInput.split('\n\n'):
		pId, *pixels = chunk.split('\n')
		pid = re.search('Tile (\d+):', pId).groups()
		top = pixels[0]
		bottom = pixels[-1]
		left = ''.join([pixels[i][0] for i in range(len(pixels))])
		right = ''.join([pixels[i][-1] for i in range(len(pixels))])
		for side in [top, bottom, left, right]:
			pixDict[side].append(pid[0])
			pixDict[side[::-1]].append(pid[0])
		tileDict[pid[0]] = {
			'side':[
				top,
				right,
				bottom[::-1],
				left[::-1]
			],
			'rotate': 0,
			'flip': 0,
			'pixels': pixels
		}

	counter = defaultdict(int)
	cornerOrSide = defaultdict(list)
	
	for side, pIds in pixDict.items():
		if len(pIds) == 1:
			cornerOrSide[pIds[0]].append(side)
	
	res = 1
	corner = ''
	for pId, side in cornerOrSide.items():
		if len(side) == 4: #includes duplicate
			res *= int(pId)
			corner = pId
	print('part1 ', res)
	
	print('\n\nstarting with corner', corner)
	tiled = []
	tmp = []
	toTile = corner
	nextSide = next(side for side in tileDict[toTile]['side'] if len(pixDict[side]) == 2)

	#rotate corner until nextSide is right
	while tileDict[toTile]['side'].index(nextSide) != 1:
		tileDict[toTile]['side'] = tileDict[toTile]['side'][1:] + tileDict[toTile]['side'][:1]
		tileDict[toTile]['rotate'] += 1

	while True:
		tmp.append(toTile)
		mirroredSide = nextSide[::-1]
		nextTile = next( i for i in pixDict[mirroredSide] if i != toTile )
		toTile = nextTile

		#flip
		if nextSide in tileDict[toTile]['side']:
			top,right,bottom,left = tileDict[toTile]['side']
			tileDict[toTile]['side'] = [ top[::-1], left[::-1], bottom[::-1], right[::-1] ]
			tileDict[toTile]['flip'] += 1
		#rotate until nextSide is right
		while tileDict[toTile]['side'].index(mirroredSide) != 3:
			tileDict[toTile]['side'] = tileDict[toTile]['side'][1:] + tileDict[toTile]['side'][:1]
			tileDict[toTile]['rotate'] += 1
			
		nextSide = tileDict[toTile]['side'][1]

		# right end
		if len(pixDict[nextSide]) == 1:
#			print('at right end', toTile)
			tmp.append(toTile)
			tiled.append(tmp)
#
			nextTopMirrored = tileDict[tmp[0]]['side'][2][::-1]
			if len(pixDict[nextTopMirrored]) == 1:
				print('at bottom end')
				break
			toTile = next( i for i in pixDict[nextTopMirrored] if i != tmp[0] )
			tmp = []

			#flip
			if not nextTopMirrored in tileDict[toTile]['side']:
				top,right,bottom,left = tileDict[toTile]['side']
				tileDict[toTile]['side'] = [ top[::-1], left[::-1], bottom[::-1], right[::-1] ]
				tileDict[toTile]['flip'] += 1
			#rotate
			while tileDict[toTile]['side'].index(nextTopMirrored) != 0:
				tileDict[toTile]['side'] = tileDict[toTile]['side'][1:] + tileDict[toTile]['side'][:1]
				tileDict[toTile]['rotate'] += 1
				
			nextSide = tileDict[toTile]['side'][1]
	print('tiled:', tiled)
	
	canvas = []
	size = len(tileDict[corner]['pixels'])
	print('size', size)
	for row in tiled:
		tmp = []
		for t in row:
			if not tmp:
				tmp = [[] for x in range(size)]

			tile = tileDict[t]
			flip = True if tile['flip'] == 1 else False
			
			for x in range(0, size):
				tmp_x = ''
				if tile['rotate']%4 == 0:
					if flip:
						tmp_x += tile['pixels'][x][::-1]
					else:
						tmp_x += tile['pixels'][x]
				elif tile['rotate']%4 == 1:
					if flip:
						tmp_x += ''.join([tile['pixels'][i][x] for i in range(0,size)])
					else:
						tmp_x += ''.join([tile['pixels'][i][size -1 -x] for i in range(0,size)])
				elif tile['rotate']%4 == 2:
					if flip:
						tmp_x += tile['pixels'][size -1 - x]
					else:
						tmp_x += tile['pixels'][size -1 - x][::-1]
				elif tile['rotate']%4 == 3:
					if flip:
						tmp_x += ''.join([tile['pixels'][i][size -1 -x] for i in range(0,size)][::-1])
					else:
						tmp_x += ''.join([tile['pixels'][i][x] for i in range(0,size)][::-1])
				tmp[x] += list(tmp_x[1:-1])

		canvas.extend(tmp[1:-1])
		tmp = []
	print()
	for l in canvas:
		print(''.join(l))

	print('snake part')
	snake = '''                  # 
#    ##    ##    ###
 #  #  #  #  #  #   '''.split('\n')
	snakeLong = len(snake[0])
	snakeHeight = len(snake)
	snakePattern = [ [x, y] for y in range(snakeHeight) for x in range(snakeLong) if snake[y][x] == '#']

	canvasSize = len(canvas)

	def findSnake(sPattern, h, l):
		for x in range(0, canvasSize - l +1):
			for y in range(0, canvasSize - h +1):
				if all([ canvas[sy+y][sx+x] == '#' for sx,sy in sPattern]):
					print('snake found at', x,y)
					for sx,sy in sPattern:
						canvas[sy+y][sx+x] = 'O'
#		for l in canvas:
#			print(l)
		print(sum([ l.count('#') for l in canvas]))
				
	findSnake(snakePattern, snakeHeight, snakeLong)
	findSnake([[snakeLong-x-1,y] for x, y in snakePattern], snakeHeight, snakeLong)
	findSnake([[x,snakeHeight-y-1] for x, y in snakePattern], snakeHeight, snakeLong)
	findSnake([[snakeLong-x-1,snakeHeight-y-1] for x, y in snakePattern], snakeHeight, snakeLong)

	findSnake([[y,x] for x, y in snakePattern], snakeLong, snakeHeight)
	findSnake([[y,snakeLong-x-1] for x, y in snakePattern], snakeLong, snakeHeight)
	findSnake([[snakeHeight-y-1,x] for x, y in snakePattern], snakeLong, snakeHeight)
	findSnake([[snakeHeight-y-1,snakeLong-x-1] for x, y in snakePattern], snakeLong, snakeHeight)
	
print('part2 ', main2(lines))