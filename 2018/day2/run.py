import re
  
file = open("input.txt", "r")
lines = file.read().split('\n')
file.close()

has2 = 0
has3 = 0

for line in lines:
	counter = {}
	for l in line:
		counter[l] = 1 + (counter[l] if l in counter else 0)
	has2 += 1 if 2 in counter.values() else 0
	has3 += 1 if 3 in counter.values() else 0

part1 = has2 * has3

def hasOneDiff(a,b):
	diff = 0
	i = 0
	diffIndex=0
	if len(a) != len(b):
		return False
	while diff < 2 and i < len(a):
		if a[i] != b[i]:
			diff += 1
			diffIndex = i
		i += 1
	if diff != 1:
		return False
	return a[0:diffIndex] + b[diffIndex+1:]
		

index = 0
for line in lines:
	index += 1
	for target in lines[index:]:
		if hasOneDiff(line, target):
			print(line)
			print(target)
			print(hasOneDiff(line, target))
