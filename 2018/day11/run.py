import re
  
file = open("input.txt", "r")
text = file.read().split('\n')
file.close()

#The rack ID is 3 + 10 = 13.
#The power level starts at 13 * 5 = 65.
#Adding the serial number produces 65 + 8 = 73.
#Multiplying by the rack ID produces 73 * 13 = 949.
#The hundreds digit of 949 is 9.
#Subtracting 5 produces 9 - 5 = 4.

serial = 7672
#serial = 18
def powerLevel(x,y):
	if x == 0 or y == 0:
		return -100
	rackId = x + 10
	level = (rackId * y + serial) * rackId
	return int(level % 1000 / 100) - 5

size = 302
field = []
for p in range(0, size*size):
	field.append(powerLevel(p%size, int(p/size)))

def findMax(tileSize):
	res = [-100]
	for f in range(len(field)):
		x, y = f%size, int(f/size)
		if x > size -tileSize +1 or y > size - tileSize +1:
			res = res
		else:
			sumAll = sum([sum(field[f+size*s:f+tileSize+size*s]) for s in range(0, tileSize)])
			if sumAll > res[0]:
				res = [sumAll, x, y]
	return res

for t in range(1,100):
	print(t, findMax(t))

