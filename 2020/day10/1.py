import re
from itertools import combinations 

test = '''16
10
15
5
1
11
7
19
6
12
4'''.split('\n')
test2 = '''28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3'''.split('\n')


file = open("input.txt", "r")
lines = file.read().split("\n")
file.close()

def part1(rawInputs):
	inputs = sorted(list(map(int, rawInputs)))
	effective = 0
	diff = { 3: 1}
	for jolt in inputs:
		if jolt > effective +3:
			print('something wrong', jolt, effective)
		diff[jolt-effective] = 1 + diff.get(jolt-effective, 0)
		effective = jolt

	print('part1 answer:', diff.get(1) * diff.get(3), '\n')
	
part1(lines)

# Check all jolts diff is within 3
def validate(jolts):
	effective = jolts[0]
	for jolt in jolts:
		if jolt - effective > 3:
			return False
		effective = jolt
	return True

# Brute force to count possible combinations
# both ends are must-have
def possibleComb(inputs):
	if len(inputs) < 3:
		return 1

	possibles = []
	for l in range(len(inputs) -2):
		possibles.extend([list(x) for x in combinations(inputs[1:-1], l)])

	count = 1 # combination of all
	for possible in possibles:
		if validate([inputs[0], *possible, inputs[-1]]):
			count += 1

	return count
		
def part2(rawInputs):
	inputs = sorted(list(map(int, rawInputs)))
	inputs.insert(0, 0)
	print('sorted input: \n', inputs)

	# Split jolts with 3 jolts diff between
	chunks = []
	index = 1
	lastSplitIndex =  0
	end = len(inputs)
	while index < end:
		if inputs[index] - inputs[index-1] == 3:
			chunks.append(inputs[lastSplitIndex:index])
			lastSplitIndex = index
		index += 1

	# remaining jolts
	chunks.append(inputs[lastSplitIndex:index])

	print('chunked jolts: \n', chunks)
	print('longest chunk is:', len(max(chunks, key=len)))

	total = 1
	for chunk in chunks:
		total *= possibleComb(chunk)
	print('part2 answer: ', total)
		
part2(lines)
