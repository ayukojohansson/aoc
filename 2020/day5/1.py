import re
  
file = open("input.txt", "r")
lines = file.read().split("\n")
file.close()


def getSeatId(code):
	row = int(code[0:7].replace('F', '0').replace('B', '1'), 2)
	col = int(code[7:10].replace('L', '0').replace('R', '1'), 2)
	return row * 8 + col

def main():
	seats = sorted(list(map(getSeatId, lines)))
	i = 0
	for i in range(len(seats)):
		if (seats[i] +1 != seats[i+1]):
			return seats[i], seats[i+1]
		i += 1

print(main())

