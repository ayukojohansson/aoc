import re
  
file = open("input.txt", "r")
text = file.read().split('\n')
file.close()

test = "position=<\s+11153,  22033> velocity=<-1, -2>"

parsed = [list(map(int, re.search('position=<\s*(-?\d+),\s+(-?\d+)> velocity=<\s*(-?\d+),\s+(-?\d+)>', line).groups())) for line in text]

minX = 0
maxX = 0
print(minX, maxX)
for p in range(len(parsed)):
	if parsed[p][0] > parsed[maxX][0]:
		maxX = p
	if parsed[p][0] < parsed[minX][0]:
		minX = p


print(minX, maxX)
print(parsed[minX], parsed[maxX])

p1 = parsed[minX].copy()
p2 = parsed[maxX].copy()
time = 11000


def findCanvas(inputs, time):
	print('\ntime: ', time)
	after = [(x+vx*time, y+vy*time) for x, y, vx, vy in inputs]
	minimumX = min(after, key=lambda x: x[0])
	maximumX = max(after, key=lambda x: x[0])
	minimumY = min(after, key=lambda x: x[1])
	maximumY = max(after, key=lambda x: x[1])
	print(minimumX, maximumX, minimumY, maximumY)
		
# time: 10942 has smallest range
#(167, 147) (228, 148) (169, 140) (211, 149)

offsetX = 140
offsetY = 140
size = 100

def paint(inputs, time):
	after = [[x+vx*time-offsetX, y+vy*time-offsetY] for x, y, vx, vy in inputs]
	canvas = [' ' for x in range(0, size*size)]
	for x,y in after:
		canvas[x + y*size] = '#'
	for l in range(0, size):
		print(''.join(canvas[l*size:(l+1)*size]))
	
paint(parsed, 10942)
