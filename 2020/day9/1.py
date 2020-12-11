import re

test = '''35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576'''.split('\n')

file = open("input.txt", "r")
lines = file.read().split("\n")
file.close()

def validate(target, numbers):
	pointer = 0
	while pointer < len(numbers):
		needed = target - numbers[pointer]
		if needed in numbers[pointer+1:]:
			return True
		pointer += 1
	return False, target

def part1(inputs, preamble):
	inputs = list(map(int, inputs))
	index = preamble
	while True:
		res = validate(inputs[index], inputs[index-preamble:index])
		if res == True:
			index += 1
		else:
			return inputs[index]


#res1 = part1(test.copy(), 5)
res1 = part1(lines.copy(), 25)

def hasRange(target, numbers):
	total = 0
	print(target, len(numbers))
	for i in range(len(numbers)):
		print(i)
		total += numbers[i]

		if (total == target):
			print('found and answer is:')
			print(min(numbers[:i]) + max(numbers[:i]))
			return True
		if (total > target):
			return False


def part2(inputs, weakness):
	inputs = list(map(int, inputs))
	weaknessIndex = inputs.index(weakness)
	index = 0
	while True:
		if hasRange(weakness, inputs[index:weakness]):
			break
		index += 1

print(part2(lines.copy(), res1))
