import re
  
file = open("input.txt", "r")
lines = file.read().strip().split("\n")
file.close()

def main(side, down):
	row = 0
	col = 0
	counter = 0
	repeat = len(lines[0])
	while row < len(lines) - down:
		row += down
		col += side
		col = col if col < repeat else col - repeat
		if lines[row][col] == '#':
			counter += 1
	return counter

print('part1: ', main(3,1))
print('part2:', main(1,1) * main(3,1) * main(5,1) * main(7,1) * main(1,2))
