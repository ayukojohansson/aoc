import re
  
file = open("input.txt", "r")
lines = file.read().replace("\n\n", "_END_").replace("\n", " ").split("_END_")
file.close()

def findIntersection(line):
	answers = [set(x) for x in line.split(' ')]
	intersection = answers[0]
	for item in answers[1:]:
		intersection &= item
	return len(set.intersection(*answers))

def main():
	answers = list(map(findIntersection, lines))
	print(answers)
	return sum(answers)

print(main())

