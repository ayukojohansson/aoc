import re
  
file = open("input.txt", "r")
lines = file.read().replace("\n\n", "_END_").replace("\n", " ").split("_END_")
file.close()

fields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

def inRange(lowerBound, upperBound, value):
	return True if int(value) >= lowerBound and int(value) <= upperBound else False

def validate(data):
	isValid = True
	for f in fields:
		field = data.get(f)
		if field == None:
			isValid = False
		elif f == 'byr':
			isValid = inRange(1920, 2002, field)
		elif f == 'iyr':
			isValid = inRange(2010, 2020, field)
		elif f == 'eyr':
			isValid = inRange(2020, 2030, field)
		elif f == 'hgt':
			match = re.fullmatch('(\d+)(cm|in)', field)
			if match:
				height = match.group(1)
				if match.group(2) == 'cm':
					isValid = inRange(150, 193, height)
				else:
					isValid = inRange(59, 76, height)
			else:
				isValid = False
		elif f == 'hcl':
			isValid = re.fullmatch('#[0123456789abcdef]{6}', field)
		elif f == 'ecl':
			isValid = re.fullmatch('(amb|blu|brn|gry|grn|hzl|oth)', field)
		elif f == 'pid':
			isValid = re.fullmatch('\d{9}', field)			

		if not isValid:
			break
	return isValid

def main():
	row = 0
	counter = 0
	for line in lines:
		passport = dict(map(lambda v: v.split(':'), line.split(' ')))
		if(validate(passport)):
			counter += 1
		print(validate(passport), passport)
		row += 1
	return counter

print(main())

