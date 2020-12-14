import re
  
file = open("input.txt", "r")
text = file.read().split('\n')
file.close()

test = '''1, 1
1, 6
8, 3
3, 4
5, 5
8, 9'''.split('\n')

def paint(array, W):
	p = 0
	while p < len(array):
		print(''.join(array[p:p+W]))
		p += W

def getDistance(x, y):
	return abs(y[1] - int(x[1])) + abs(y[0] - int(x[0]))

def part1(inputs, width):
	dots = [x.split(', ') for x in inputs]
	longest = width * width
	mapped = [x for x in range(longest)]
	stats = [0 for x in range(len(dots))]
	infinite = set()
	for pixel in mapped:
		dotIndex = 0
		px, py = pixel % width, int(pixel / width)
		distance = [longest]
		while dotIndex < len(inputs):
			disToDot = getDistance(dots[dotIndex], [px, py])
#			print(disToDot, dots[dotIndex], [px, py])
			if distance[0] > disToDot:
				distance = [disToDot, dotIndex]
			elif distance[0] == disToDot:
				distance.append(dotIndex)
			dotIndex += 1
#		print(distance)
		if len(distance) == 2:
			mapped[pixel] = distance[1]
			stats[distance[1]] += 1
			if px == 0 or py == 0 or px == width -1 or py == width -1:
				infinite.add(distance[1])

	for discard in infinite:
		stats[discard] = 0
	print(max(stats))
	return mapped

#part1(text, 400)

def part2(inputs, width, limit):
	dots = [x.split(', ') for x in inputs]
	longest = width * width
	mapped = [x for x in range(longest)]
	stats = 0
	for pixel in mapped:
		dotIndex = 0
		px, py = pixel % width, int(pixel / width)
		total = 0
		while dotIndex < len(inputs):
			disToDot = getDistance(dots[dotIndex], [px, py])
			total += disToDot
			dotIndex += 1

		if total < limit:
			stats += 1

	print(stats)
	return stats

part2(text, 400, 10000)
