from collections import deque, defaultdict

file = open("input.txt", "r")
inputs = file.read()
file.close()

def parse(lines):
	res = defaultdict(int)
	for line in lines:
		tmp = {
			'e': 0,
			'se': 0,
			'sw': 0,
			'w': 0,
			'nw': 0,
			'ne': 0
		}
#		e, se, sw, w, nw, ne
		prev = ''
		for s in line:
			if prev:
				tmp[prev+s] += 1
				prev = ''
			elif s in 'sn':
				prev = s
			else:
				tmp[s] += 1

		x,y = 0,0
		for d in tmp.keys():
			if d == 'e':
				x += 2 * tmp[d]
			elif d == 'w':
				x -= 2* tmp[d]
			elif d == 'ne':
				x += 1* tmp[d]
				y += 1* tmp[d]
			elif d == 'se':
				x += 1* tmp[d]
				y -= 1* tmp[d]
			elif d == 'nw':
				x -= 1* tmp[d]
				y += 1* tmp[d]
			elif d == 'sw':
				x -= 1* tmp[d]
				y -= 1* tmp[d]
		
		res[(x,y)] += 1
	return res
		
def removeWhite(dots):
	blacks = {}
	for dot in dots.keys():
		if dots[dot] % 2 == 1:
			blacks[dot] = 1
	return blacks
	
def get6(dot, dots):
	x,y = dot
	return sum([dots.get(d, 0) for d in [
		(x+2,y),
		(x+1,y-1),
		(x-1,y-1),
		(x-2,y),
		(x-1,y+1),
		(x+1,y+1),
	]])

def main(rawInput,lastDay):
	dots = parse(rawInput.split('\n'))

	blacks = removeWhite(dots)
	print('day 0 (part 1),', len(blacks))
	
	day = 0
	while day < lastDay:

		tiles = {}
		toCheck = []
		for dot in blacks.keys():
			adjacents = get6(dot, blacks) 
			tiles[dot] = 0 if adjacents == 0 or adjacents > 2 else 1
			x,y = dot
			toCheck.extend([
				(x+2,y),
				(x+1,y-1),
				(x-1,y-1),
				(x-2,y),
				(x-1,y+1),
				(x+1,y+1),
			])

		# white arounds black
		for dot in toCheck:
			if dot in tiles:
				continue
			adjacents = get6(dot, blacks) 
			tiles[dot] = 1 if adjacents == 2 else 0

		blacks = removeWhite(tiles)
		day += 1
	print('day', day, len(blacks))

test = '''sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew'''

main(inputs, 100)

print('\n\n--- test')
main(test,100)
