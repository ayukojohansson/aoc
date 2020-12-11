file = open("input.txt", "r")

lines = file.read().strip().split("\n")
file.close()

index1 = 0;
while index1 < len(lines):
	index2 = index1 + 1
	first = int(lines[index1])
	while index2 < len(lines):
		index3 = index2 + 1
		second = int(lines[index2])
		while index3 < len(lines):
			third = int(lines[index3])
			if (first + second + third == 2020):
				print("found it")
				print(first * second * third)
			index3 += 1
		index2 += 1
	index1 += 1
