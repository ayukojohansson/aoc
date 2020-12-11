import re

test = '''nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6'''.split('\n')

file = open("input.txt", "r")
lines = file.read().split("\n")
file.close()

def part1(inputs):
	acc = 0
	pointer = 0
	wasLoop = False
	while pointer < len(inputs):
		comm, value = inputs[pointer].split(' ')
		if comm == 'loop':
			wasLoop = True
			break
		else:
			inputs[pointer] = 'loop 0'

		intValue = int(value)
		if comm == 'acc':
			acc += intValue
			pointer += 1
		elif comm == 'nop':
			pointer += 1
		elif comm == 'jmp' :
			pointer += intValue

	return wasLoop, acc
	
def part2(inputs):
	fixPointer = 0
	while True:
		copy = inputs.copy()
		command = inputs[fixPointer][:3]

		if command == 'nop':
			copy[fixPointer] = copy[fixPointer].replace('nop', 'jmp')
		elif command == 'jmp':
			copy[fixPointer] = copy[fixPointer].replace('jmp', 'nop')

		looped, acc = part1(copy)

		if looped == False:
			return acc
		else:
			fixPointer += 1

print(part1(lines.copy()))
print(part2(lines.copy()))