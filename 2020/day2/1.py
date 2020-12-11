import re
  
file = open("input.txt", "r")
lines = file.read().strip().split("\n")
file.close()

counter1 = 0
counter2 = 0
for line in lines:
	atLeast, atMost, letter, password = re.search('(\d+)-(\d+) ([a-z]): ([a-z]+)$', line).groups()

#	matchingLetters = re.sub(rf"[^{letter}]", '', password)
	matchingLetters = password.count(letter)
	if matchingLetters >= int(atLeast) and matchingLetters <= int(atMost):
		counter1 += 1
	if int(atMost) > len(password):
		continue
	left = 1 if password[int(atLeast)-1] == letter else 0
	right = 1 if password[int(atMost)-1] == letter else 0
	
	if (left + right) == 1:
		counter2 += 1

print('part1', counter1)
print('part2', counter2)
