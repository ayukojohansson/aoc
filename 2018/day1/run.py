import re
  
file = open("input.txt", "r")
lines = file.read().split('\n')
file.close()

freq = [int(line) for line in lines]
#freq = [int(line) for line in [+7, +7, -2, -7, -4]]
part1 = sum(freq)

occurence = set([0])
subTotal = 0
stop = False

while not stop:
	for f in freq:
		subTotal += f
#		print(subTotal, f, occurence)
		if subTotal in occurence:
			print(subTotal)
			stop = True
			break
		else:
			occurence.add(subTotal)

print(subTotal)