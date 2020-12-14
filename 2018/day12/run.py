import re
  
file = open("input.txt", "r")
text = file.read().split('\n')
file.close()

initialState = '##..##..#.##.###....###.###.#.#.######.#.#.#.#.##.###.####..#.###...#######.####.##...#######.##..#'


test='#..#.#..##......###...###'
test_rules='''...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #'''.split('\n')

def parse(lines):
	r = {}
	return list([ [list(l[0:5]), l[9:10]] for l in lines])


def part1(rawInputs, initial, gen):
	inputs = parse(rawInputs)
	field = [*['.' for x in range(gen)], *initial, *['.' for x in range(gen)]]
	print(''.join(field))
	
	start = 2
	end = len(initial) + 2*gen - 2
	for g in range(gen):
		field = ['.', '.', *[update(field[x-2:x+3], inputs) for x in range(start, end)], '.', '.']

		print(''.join(field))
	

	return sum([potNr-gen if field[potNr] == '#' else 0  for potNr in range(len(field))])

#print(part1(text,initialState, 20))

from collections import deque, defaultdict
from itertools import islice

def updateAndBreak(field, rules):
	res = []
	length = len(field)
	split = []
	for x in range(length):
		if x < 2 or x > length - 3:
			res.append('.')
			continue
		nearby = field[x-2:x+3]
#		print('updateAndBreak', nearby, x)
		if not nearby.count('#'):
			split = field[x+3:]
		
		for rule in rules:
	#		print(nearby, rule[0] == nearby, rule[1])
			if rule[0] == nearby:
				res.append(rule[1])
				break
	return res, split
	
def part2(rawInputs, initial, gen):
	inputs = parse(rawInputs)

	field = ['.','.', '.', '.', *initial, '.','.', '.', '.']

	potZero = 4
	print('start')
	print(''.join(field))
	toDo = [[ field, 4 ]]

	for g in range(gen):
		newToDo = []
		for field, potOffset in toDo:
#			print('field', field, potOffset)
			while field.index('#') < 4:
				potOffset += 1
				field.insert(0, '.')
			field, splitted = updateAndBreak(field, inputs)
			if splitted and splitted.count('#'):
				newToDo.append([ splitted, potOffset + len(field)])
				print('spritted', splitted, 'offset', len(field) + potOffset)
			if field[3] == '#':
#				print('padding, 1', potOffset, field)
				field.insert(0, '.')
				potOffset += 1
			elif field[4] == '.':
				field = field[1:]
				potOffset -= 1
			if field[-4] == '#':
				field.append('.')
			if g%1 == 0:
	#			print(g)
				print(''.join(field), potOffset)
#			print('potOffset', potOffset)
			newToDo.append([field, potOffset])
		toDo = newToDo
		print('\nnewTodo:\n', newToDo)

	total = 0
	for field, potOffset in toDo:
		total += sum([potNr-potOffset if field[potNr] == '#' else 0 for potNr in range(len(field))])

	print(total)

part2(test_rules,test, 20)
#part2(text,initialState, 2)