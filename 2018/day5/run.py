import re
  
file = open("input.txt", "r")
text = file.read()
file.close()

test = 'dabAcCaCBAcCcaDA'

def react(stringList):
	index = 0
	while index < len(stringList) - 1:
#		print(index)
		if stringList[index].swapcase() == stringList[index + 1]:
			stringList = stringList[:index]+stringList[index+2:]
			index -= 1 if index > 0 else 0
		else:
			index += 1

	return stringList

print(len(react(test)))
print('part1', len(react(text)))

part2 = []
for letter in 'abcdefghijklmnopqrstuvwxyz':
	res = len(react(text.replace(letter, '').replace(letter.swapcase(), '')))
	part2.append(res)
	print(letter, res)
print(min(part2))
	
