import re
  
file = open("input.txt", "r")
lines = file.read().split('\n')
file.close()

canvas = {}
W = 1000

#lines = '''#1 @ 1,3: 4x4
##2 @ 3,1: 4x4
##3 @ 5,5: 2x2'''.split('\n')

def paint(c):
	lastBit = max(canvas.keys())
	p = 0
	res = ''
	while p <= lastBit:
		res += ('.' if not p in canvas else '1' if canvas[p] == 1 else 'X')
		p += 1
	p = 0
	while p < len(res):
		print(res[p:p+W])
		p += W

def fill(c_id, side, down, width, height):
	for i in range(side, side+width):
		for j in range(down, down+height):
			index = i + W*j
			canvas[index] = 1 + (canvas[index] if index in canvas else 0)
	return

for line in lines:
	fill(*list(map(int, re.search('#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$', line).groups())))

#paint(canvas)

#part1
print(sum(list(map(lambda x: 1 if x > 1 else 0, canvas.values()))))


#part2
def check(c_id, side, down, width, height):
	overlap = False
	for i in range(side, side+width):
		for j in range(down, down+height):
			index = i + W*j
			if canvas[index] > 1:
				overlap = True
				break
		if overlap:
			break
	if not overlap:
		print(c_id)
	return overlap

#for line in lines:
#	check(*list(map(int, re.search('#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$', line).groups())))

print(next( line for line in lines if not check(*list(map(int, re.search('#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$', line).groups()))) ))